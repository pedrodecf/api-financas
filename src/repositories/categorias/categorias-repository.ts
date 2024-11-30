import { Categoria, Prisma } from "@prisma/client"

export interface CategoriasRepository {
   create(data: Prisma.CategoriaUncheckedCreateInput): Promise<Categoria>
   findByUsuarioId(usuarioId: string): Promise<Categoria[]>
   findById(id: number): Promise<Categoria | null>
   delete(id: number): Promise<Categoria>
   update(id: number, data: Prisma.CategoriaUncheckedUpdateInput): Promise<Categoria>
}