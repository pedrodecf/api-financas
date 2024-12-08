import { Categoria, Prisma } from "@prisma/client"

export interface CategoriasRepository {
   create(
      data: Prisma.CategoriaUncheckedCreateInput, tx?: Prisma.TransactionClient
   ): Promise<Categoria>

   findByUsuarioId(
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria[]>

   findByName(
      nome: string,
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria | null>

   findById(id: number,
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria | null>

   delete(
      id: number,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria>

   update(id: number,
      data: Prisma.CategoriaUncheckedUpdateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria>
}