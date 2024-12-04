import { Prisma, Transacao } from "@prisma/client"
import { RecursoNaoEncontradoError } from "../errors/recurso-nao-encontrado.error"
import { TransacoesRepository } from "../repositories/transacoes/transacoes-repository"

interface Props {
   transacaoId: number
   tx: Prisma.TransactionClient
   transacoesRepository: TransacoesRepository
}

export async function validateTransacao({
   transacaoId,
   tx,
   transacoesRepository
}: Props): Promise<Transacao> {
   const transacao = await transacoesRepository.findById(transacaoId, tx)

   if (!transacao) {
      throw new RecursoNaoEncontradoError('Transação não encontrada')
   }

   return transacao
}