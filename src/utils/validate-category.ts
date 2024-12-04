import { Categoria, Prisma } from "@prisma/client"
import { CategoriasRepository } from "../repositories/categorias/categorias-repository"
import { RecursoNaoEncontradoError } from "../errors/recurso-nao-encontrado.error"

interface Props {
   categoriaId: number
   usuarioId: string
   tx: Prisma.TransactionClient
   categoriasRepository: CategoriasRepository
}

export async function validateCategoria({
   categoriaId,
   usuarioId,
   tx,
   categoriasRepository
}: Props): Promise<Categoria> {
   const categoria = await categoriasRepository.findById(categoriaId, usuarioId, tx)

   if (!categoria) {
      throw new RecursoNaoEncontradoError('Categoria não encontrada')
   }

   return categoria
}