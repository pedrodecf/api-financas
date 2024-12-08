import { Prisma, Transacao } from "@prisma/client";
import { TransacoesRepository } from "./transacoes-repository";
import { prisma } from "../../lib/prisma";

export class TransacoesHttpRepository implements TransacoesRepository {
   async $transaction<T>(
      fn: (tx: Prisma.TransactionClient) => Promise<T>
   ): Promise<T> {
      return prisma.$transaction(fn);
   }

   async create(
      data: Prisma.TransacaoUncheckedCreateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao> {
      const prismaInstance = tx || prisma
      return prismaInstance.transacao.create({ data })
   }

   async findByUsuarioId(
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao[]> {
      const prismaInstance = tx || prisma
      return prismaInstance.transacao.findMany({
         where: {
            usuarioId,
            deleted_at: null
         }
      })
   }

   async findById(
      id: number,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao | null> {
      const prismaInstance = tx || prisma
      return prismaInstance.transacao.findUnique({
         where: {
            id,
            deleted_at: null
         }
      })
   }

   async delete(
      id: number,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao> {
      const prismaInstance = tx || prisma
      return prismaInstance.transacao.update({
         where: {
            id,
            deleted_at: null
         },
         data: { deleted_at: new Date() }
      })
   }

   async list(
      params: {
         where?: Prisma.TransacaoWhereInput;
         orderBy?: Prisma.TransacaoOrderByWithRelationInput;
         skip?: number;
         take?: number;
         include?: Prisma.TransacaoInclude;
         select?: Prisma.TransacaoSelect;
      },
      tx?: Prisma.TransactionClient
   ): Promise<Transacao[]> {
      const prismaClient = tx || prisma;
      return prismaClient.transacao.findMany(params);
   }

   async count(
      params: { where?: Prisma.TransacaoWhereInput },
      tx?: Prisma.TransactionClient
   ): Promise<number> {
      const prismaClient = tx || prisma;
      return prismaClient.transacao.count(params);
   }

   async update(
      id: number,
      data: Prisma.TransacaoUncheckedUpdateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao> {
      const prismaClient = tx || prisma;
      return prismaClient.transacao.update({
         where: {
            id,
            deleted_at: null
         },
         data
      });
   }

   async findByCategoriaId(
      categoriaId: number,
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao[]> {
      const prismaClient = tx || prisma;
      return prismaClient.transacao.findMany({
         where: {
            categoriaId,
            usuarioId,
            deleted_at: null
         }
      });
   }
}