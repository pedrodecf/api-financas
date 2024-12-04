import { TipoTransacao, Transacao, Usuario } from "@prisma/client";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";
import { validateUser } from "../../utils/validate-user";
import { validateCategoria } from "../../utils/validate-category";
import { createTransaction } from "../../utils/create-transaction";
import { updateBalance } from "../../utils/update-balance";

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
      private readonly transacoesRepository: TransacoesRepository,
      private readonly usuariosRepository: UsuarioRepository,
      private readonly categoriasRepository: CategoriasRepository
   ) { }

   async execute({
      valor,
      categoriaId,
      descricao,
      data,
      tipo,
      usuarioId
   }: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
      return this.transacoesRepository.$transaction(async (tx) => {
         const usuario = await validateUser({
            usuarioId,
            tx,
            usuarioRepository: this.usuariosRepository
         })

         await validateCategoria({
            categoriaId,
            usuarioId,
            tx,
            categoriasRepository: this.categoriasRepository
         })

         const transacao = await createTransaction({
            data: {
               valor,
               categoriaId,
               descricao,
               data: data ? new Date(data) : new Date(),
               tipo,
               usuarioId
            },
            tx,
            transacoesRepository: this.transacoesRepository
         })

         const usuarioAtualizado = await updateBalance({
            usuario,
            balanceData: { valor, tipo },
            tx,
            usuariosRepository: this.usuariosRepository
         })

         return {
            transacao,
            usuario: usuarioAtualizado
         }
      })
   }
}