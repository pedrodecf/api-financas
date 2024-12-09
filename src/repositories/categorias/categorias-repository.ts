import { Categoria, Prisma } from "@prisma/client"

export interface CategoriasRepository {
   $transaction<T>(
      fn: (tx: Prisma.TransactionClient) => Promise<T>
   ): Promise<T>

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

   list(
      params: {
         where?: Prisma.CategoriaWhereInput;
         orderBy?: Prisma.CategoriaOrderByWithRelationInput;
         skip?: number;
         take?: number;
         include?: Prisma.CategoriaInclude;
         select?: Prisma.CategoriaSelect;
      },
      tx?: Prisma.TransactionClient
   ): Promise<Categoria[]>;

   count(
      params: { where?: Prisma.CategoriaWhereInput },
      tx?: Prisma.TransactionClient
   ): Promise<number>;
}