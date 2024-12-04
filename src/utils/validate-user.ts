import { Prisma, Usuario } from "@prisma/client"
import { RecursoNaoEncontradoError } from "../errors/recurso-nao-encontrado.error"
import { UsuarioRepository } from "../repositories/usuarios/usuario-repository"

interface Props {
   usuarioId: string
   tx: Prisma.TransactionClient
   usuarioRepository: UsuarioRepository
}

export async function validateUser({
   usuarioId,
   tx,
   usuarioRepository
}: Props): Promise<Usuario> {
   const usuario = await usuarioRepository.findById(usuarioId, tx)

   if (!usuario) {
      throw new RecursoNaoEncontradoError('Usuário não encontrado')
   }

   return usuario
}