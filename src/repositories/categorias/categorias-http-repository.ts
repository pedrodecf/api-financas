import { Prisma, Categoria } from "@prisma/client";
import { CategoriasRepository } from "./categorias-repository";
import { prisma } from "../../lib/prisma";

export class CategoriasHttpRepository implements CategoriasRepository {
   async create(data: Prisma.CategoriaUncheckedCreateInput): Promise<Categoria> {
      const categoria = await prisma.categoria.create({ data })
      return categoria
   }

   async findByUsuarioId(usuarioId: string): Promise<Categoria[]> {
      const categorias = prisma.categoria.findMany({
         where: {
            usuarioId,
            deleted_at: null
         }
      })

      return categorias
   }

   async findByName(nome: string, usuarioId: string): Promise<Categoria | null> {
      const categoria = prisma.categoria.findFirst({
         where: {
            nome,
            usuarioId,
            deleted_at: null
         }
      })
      return categoria
   }

   async findById(id: number, usuarioId: string, tx?: Prisma.TransactionClient): Promise<Categoria | null> {
      const prismaInstance = tx || prisma
      return prismaInstance.categoria.findUnique({
         where: {
            id,
            usuarioId,
            deleted_at: null
         }
      })
   }

   async delete(id: number): Promise<Categoria> {
      const categoria = prisma.categoria.update({
         where: { id },
         data: { deleted_at: new Date() }
      })
      return categoria
   }

   async update(id: number, data: Prisma.CategoriaUncheckedUpdateInput): Promise<Categoria> {
      const categoria = prisma.categoria.update({
         where: { id },
         data
      })
      return categoria
   }

}