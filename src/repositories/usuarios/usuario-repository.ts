import { Prisma, TipoTransacao, Usuario } from "@prisma/client"

export interface UsuarioRepository {
   create(data: Prisma.UsuarioUncheckedCreateInput): Promise<Usuario>
   findByEmail(email: string): Promise<Usuario | null>
   findById(id: string, tx?: Prisma.TransactionClient): Promise<Usuario | null>
   updateBalanco(usuario: Usuario, novoBalanco: number, tx?: Prisma.TransactionClient): Promise<Usuario>
}