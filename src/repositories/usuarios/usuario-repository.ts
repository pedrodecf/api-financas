import { Prisma, Usuario } from "@prisma/client"

export interface UsuarioRepository {
   create(
      data: Prisma.UsuarioUncheckedCreateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario>

   findByEmail(
      email: string,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario | null>

   findById(
      id: string,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario | null>

   updateBalanco(
      usuario: Usuario,
      novoBalanco: number,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario>
}