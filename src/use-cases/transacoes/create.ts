import { TipoTransacao, Transacao, Usuario, Prisma } from "@prisma/client";
import { TransacoesHttpRepository } from "../../repositories/transacoes/transacoes-http-repository";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { RecursoNaoEncontradoError } from "../../errors/recurso-nao-encontrado.error";
import { SaldoInsuficienteError } from "../../errors/saldo-insuficiente.error";
import { prisma } from "../../lib/prisma";

interface CreateUseCaseRequest {
   valor: number
   categoriaId: number
   descricao?: string
   data?: Date
   tipo: TipoTransacao
   usuarioId: string
}

interface CreateUseCaseResponse {
   transacao: Transacao
   usuario: Usuario
}

export class CreateUseCase {
   constructor(
      private readonly transacoesRepository: TransacoesHttpRepository,
      private readonly usuariosRepository: UsuarioHttpRepository,
      private readonly categoriasRepository: CategoriasHttpRepository
   ) { }

   async execute({
      valor,
      categoriaId,
      descricao,
      data,
      tipo,
      usuarioId
   }: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
      return prisma.$transaction(async (tx) => {
         const usuario = await this.validateUser(usuarioId, tx)

         await this.validateCategoria(categoriaId, tx)

         const transacao = await this.createTransaction({
            valor,
            categoriaId,
            descricao,
            data: data || new Date(),
            tipo,
            usuarioId
         }, tx)

         const usuarioAtualizado = await this.updateBalance(
            usuario,
            { valor, tipo },
            tx
         )

         return {
            transacao,
            usuario: usuarioAtualizado
         }
      })
   }

   private async validateUser(
      usuarioId: string,
      tx: Prisma.TransactionClient
   ): Promise<Usuario> {
      const usuario = await this.usuariosRepository.findById(usuarioId, tx)

      if (!usuario) {
         throw new RecursoNaoEncontradoError('Usuário não encontrado')
      }

      return usuario
   }

   private async validateCategoria(
      categoriaId: number,
      tx: Prisma.TransactionClient
   ): Promise<void> {
      const categoria = await this.categoriasRepository.findById(categoriaId, tx)

      if (!categoria) {
         throw new RecursoNaoEncontradoError('Categoria não encontrada')
      }
   }

   private async createTransaction(
      data: CreateUseCaseRequest,
      tx: Prisma.TransactionClient
   ): Promise<Transacao> {
      return this.transacoesRepository.create({
         ...data,
         data: data.data || new Date()
      }, tx)
   }

   private async updateBalance(
      usuario: Usuario,
      balanceData: { valor: number, tipo: TipoTransacao },
      tx: Prisma.TransactionClient
   ): Promise<Usuario> {
      const { valor, tipo } = balanceData

      if (tipo === TipoTransacao.Saida && usuario.balanco < valor) {
         throw new SaldoInsuficienteError()
      }

      const novoBalanco = tipo === TipoTransacao.Entrada
         ? usuario.balanco + valor
         : usuario.balanco - valor

      return this.usuariosRepository.updateBalanco(
         usuario,
         novoBalanco,
         tx
      )
   }
}