import { Prisma, Transacao } from "@prisma/client"

export interface TransacoesRepository {
   $transaction<T>(
      fn: (tx: Prisma.TransactionClient) => Promise<T>
   ): Promise<T>

   create(
      data: Prisma.TransacaoUncheckedCreateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao>

   findByUsuarioId(
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao[]>

   findById(
      id: number,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao | null>

   delete(
      id: number,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao>

   list(
      params: {
         where?: Prisma.TransacaoWhereInput;
         orderBy?: Prisma.TransacaoOrderByWithRelationInput;
         skip?: number;
         take?: number;
         include?: Prisma.TransacaoInclude;
         select?: Prisma.TransacaoSelect;
      },
      tx?: Prisma.TransactionClient
   ): Promise<Transacao[]>;

   count(
      params: { where?: Prisma.TransacaoWhereInput },
      tx?: Prisma.TransactionClient
   ): Promise<number>;

   update(
      id: number,
      data: Prisma.TransacaoUncheckedUpdateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao>;

   findByCategoriaId(
      categoriaId: number,
      usuarioId: string,
      tx?: Prisma.TransactionClient
   ): Promise<Transacao[]>;
}