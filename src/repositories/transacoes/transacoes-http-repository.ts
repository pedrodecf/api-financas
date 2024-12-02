import { Prisma, TipoTransacao, Transacao } from "@prisma/client";
import { TransacoesRepository } from "./transacoes-repository";
import { prisma } from "../../lib/prisma";

type Order = {
   orderBy: 'id' | 'nome' | 'createdAt';
   ordination: 'asc' | 'desc';
};

type Pagination = {
   page: number;
   quantity: number;
};

type Filters = {
   tipo: TipoTransacao;
   valor: number;
   valor_filter: 'equals' | 'gt' | 'lt';
   categoriaId: number;
   usuarioId: string;
   mes: number;
   ano: number;
};


export class TransacoesHttpRepository implements TransacoesRepository {
   async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
      return prisma.$transaction(fn);
   }

   async create(data: Prisma.TransacaoUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<Transacao> {
      const prismaInstance = tx || prisma
      return prismaInstance.transacao.create({ data })
   }

   async findByUsuarioId(usuarioId: string): Promise<Transacao[]> {
      const transacoes = await prisma.transacao.findMany({
         where: {
            usuarioId,
            deleted_at: null
         }
      })

      return transacoes
   }

   async findById(id: number): Promise<Transacao | null> {
      const transacao = prisma.transacao.findUnique({ where: { id } })
      return transacao
   }

   async delete(id: number): Promise<Transacao> {
      const transacao = prisma.transacao.update({
         where: { id },
         data: { deleted_at: new Date() }
      })
      return transacao
   }

   async list(
      params: {
         where?: Prisma.TransacaoWhereInput;
         orderBy?: Prisma.TransacaoOrderByWithRelationInput;
         skip?: number;
         take?: number;
         include?: Prisma.TransacaoInclude;
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
}