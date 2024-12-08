import { TipoTransacao, Transacao, Usuario } from "@prisma/client";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { NaoAutorizadoError } from "../../errors/nao-autorizado.error";
import { validateTransacao } from "../../utils/validate-transaction";
import { validateUser } from "../../utils/validate-user";
import { validateCategoria } from "../../utils/validate-category";
import { updateBalance } from "../../utils/update-balance";

interface UpdateUseCaseRequest {
   id: number
   valor: number
   categoriaId?: number
   descricao?: string
   data?: Date
   tipo: TipoTransacao
   usuarioId: string
}

interface UpdateUseCaseResponse {
   transacao: Transacao
   usuario: Usuario
}

export class UpdateUseCase {
   constructor(
      private readonly transacoesRepository: TransacoesRepository,
      private readonly usuariosRepository: UsuarioRepository,
      private readonly categoriasRepository: CategoriasRepository
   ) { }

   async execute({
      id,
      valor,
      categoriaId,
      descricao,
      data,
      tipo,
      usuarioId
   }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
      return this.transacoesRepository.$transaction(async (tx) => {
         const transacao = await validateTransacao({
            transacaoId: id,
            tx,
            transacoesRepository: this.transacoesRepository
         })

         const usuario = await validateUser({
            usuarioId,
            tx,
            usuarioRepository: this.usuariosRepository
         })

         if (transacao.usuarioId !== usuarioId) {
            throw new NaoAutorizadoError()
         }

         if (categoriaId) {
            await validateCategoria({
               categoriaId,
               usuarioId,
               tx,
               categoriasRepository: this.categoriasRepository
            })
         }

         const transacaoAtualizada = await this.transacoesRepository.update(id, {
            valor,
            categoriaId,
            descricao,
            data,
            tipo
         }, tx)

         let usuarioAtualizado = usuario

         if (transacao.valor !== valor || transacao.tipo !== tipo) {
            let valorNovo = 0

            if (tipo === 'Entrada') {
               if (transacao.tipo === 'Saida') {
                  valorNovo = valor + transacao.valor
               }
               if (transacao.tipo === 'Entrada') {
                  valorNovo = valor - transacao.valor
               }
            }

            if (tipo === 'Saida') {
               if (transacao.tipo === 'Entrada') {
                  valorNovo = valor + transacao.valor
               }

               if (transacao.tipo === 'Saida') {
                  valorNovo = valor - transacao.valor
               }

               usuarioAtualizado = await updateBalance({
                  usuario,
                  balanceData: { valor: valorNovo, tipo },
                  tx,
                  usuariosRepository: this.usuariosRepository,
                  isTipoSaida: true,
                  saldoOriginalTransacao: transacao.valor
               })

               return {
                  transacao: transacaoAtualizada,
                  usuario: usuarioAtualizado
               }
            }

            usuarioAtualizado = await updateBalance({
               usuario,
               balanceData: { valor: valorNovo, tipo },
               tx,
               usuariosRepository: this.usuariosRepository
            })
         }

         return {
            transacao: transacaoAtualizada,
            usuario: usuarioAtualizado
         }
      })
   }
}