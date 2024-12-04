import { Prisma, Transacao } from "@prisma/client"

export interface TransacoesRepository {
   $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>
   create(data: Prisma.TransacaoUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<Transacao>
   findByUsuarioId(usuarioId: string): Promise<Transacao[]>
   findById(id: number): Promise<Transacao | null>
   delete(id: number): Promise<Transacao>
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
}