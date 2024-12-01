import { Categoria, Prisma } from "@prisma/client"

export interface CategoriasRepository {
   create(data: Prisma.CategoriaUncheckedCreateInput): Promise<Categoria>
   findByUsuarioId(usuarioId: string): Promise<Categoria[]>
   findByName(nome: string, usuarioId: string): Promise<Categoria | null>
   findById(id: number, tx?: Prisma.TransactionClient): Promise<Categoria | null>
   delete(id: number): Promise<Categoria>
   update(id: number, data: Prisma.CategoriaUncheckedUpdateInput): Promise<Categoria>
}