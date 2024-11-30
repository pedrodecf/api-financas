import { Prisma, Usuario } from "@prisma/client"

export interface UsuarioGateway {
   create(data: Prisma.UsuarioUncheckedCreateInput): Promise<Usuario>
   findByEmail(email: string): Promise<Usuario | null>
   findById(id: string): Promise<Usuario | null>
}