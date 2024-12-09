import { Prisma, Categoria } from "@prisma/client";
import { CategoriasRepository } from "./categorias-repository";
import { prisma } from "../../lib/prisma";

export class CategoriasHttpRepository implements CategoriasRepository {
   async $transaction<T>(
      fn: (tx: Prisma.TransactionClient) => Promise<T>
   ): Promise<T> {
      return prisma.$transaction(fn);
   }
   
   async create(
      data: Prisma.CategoriaUncheckedCreateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria> {
      const prismaInstance = tx || prisma
      return prismaInstance.categoria.create({
         data
      })
   }

   async findByUsuarioId(
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria[]> {
      const prismaInstance = tx || prisma
      return prismaInstance.categoria.findMany({
         where: {
            usuarioId,
            deleted_at: null
         }
      })
   }

   async findByName(
      nome: string,
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria | null> {
      const prismaInstance = tx || prisma
      return prismaInstance.categoria.findFirst({
         where: {
            nome,
            usuarioId,
            deleted_at: null
         }
      })
   }

   async findById(
      id: number,
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria | null> {
      const prismaInstance = tx || prisma
      return prismaInstance.categoria.findUnique({
         where: {
            id,
            usuarioId,
            deleted_at: null
         }
      })
   }

   async delete(
      id: number,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria> {
      const prismaInstance = tx || prisma
      return prismaInstance.categoria.update({
         where: {
            id
         },
         data: {
            deleted_at: new Date()
         }
      })
   }

   async update(
      id: number,
      data: Prisma.CategoriaUncheckedUpdateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Categoria> {
      const prismaInstance = tx || prisma
      return prismaInstance.categoria.update({
         where: {
            id,
            deleted_at: null
         },
         data
      })
   }

   async list(
      params: {
         where?: Prisma.CategoriaWhereInput;
         orderBy?: Prisma.CategoriaOrderByWithRelationInput;
         skip?: number;
         take?: number;
         include?: Prisma.CategoriaInclude;
         select?: Prisma.CategoriaSelect;
      },
      tx?: Prisma.TransactionClient
   ): Promise<Categoria[]> {
      const prismaClient = tx || prisma;
      return prismaClient.categoria.findMany(params);
   }

   async count(
      params: { where?: Prisma.CategoriaWhereInput },
      tx?: Prisma.TransactionClient
   ): Promise<number> {
      const prismaClient = tx || prisma;
      return prismaClient.categoria.count(params);
   }
}