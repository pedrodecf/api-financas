import { Prisma, Transacao } from "@prisma/client"
import { TransacoesRepository } from "../repositories/transacoes/transacoes-repository"

interface Props {
   data: any
   tx: Prisma.TransactionClient
   transacoesRepository: TransacoesRepository
}

export async function createTransaction({
   data,
   tx,
   transacoesRepository
}: Props): Promise<Transacao> {
   return transacoesRepository.create({
      ...data,
      data: data.data || new Date()
   }, tx)
}