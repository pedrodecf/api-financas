import { Prisma, Transacao } from "@prisma/client"

export interface TransacoesRepository {
   create(data: Prisma.TransacaoUncheckedCreateInput): Promise<Transacao>
   findByUsuarioId(usuarioId: string): Promise<Transacao[]>
   findById(id: number): Promise<Transacao | null>
   delete(id: number): Promise<Transacao>
}