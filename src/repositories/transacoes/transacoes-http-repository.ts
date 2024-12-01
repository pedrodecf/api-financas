import { Prisma, Transacao } from "@prisma/client";
import { TransacoesRepository } from "./transacoes-repository";
import { prisma } from "../../lib/prisma";

export class TransacoesHttpRepository implements TransacoesRepository {
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

}