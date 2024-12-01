import { Prisma, Transacao } from "@prisma/client";
import { TransacoesRepository } from "./transacoes-repository";

export class TransacoesInMemoryRepository implements TransacoesRepository {
   public transacoes: Transacao[] = []

   async create(data: Prisma.TransacaoUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<Transacao> {
      const transacao: Transacao = {
         id: data.id || this.transacoes.length + 1,
         valor: data.valor,
         tipo: data.tipo,
         descricao: data.descricao || 'descricao',
         data: data.data ? new Date(data.data) : new Date(),
         categoriaId: data.categoriaId || 1,
         usuarioId: data.usuarioId || '1',
         deleted_at: null,
      }

      this.transacoes.push(transacao)
      return transacao
   }

   async findByUsuarioId(usuarioId: string): Promise<Transacao[]> {
      const transacoes = this.transacoes.filter(transacao => transacao.usuarioId === usuarioId)
      return transacoes
   }

   async findById(id: number): Promise<Transacao | null> {
      const transacao = this.transacoes.find(transacao => transacao.id === id)
      if (!transacao) return null
      return transacao
   }

   async delete(id: number): Promise<Transacao> {
      const transacao = this.transacoes.find(transacao => transacao.id === id)
      if (!transacao) throw new Error('Transacao não encontrada')
      transacao.deleted_at = new Date()
      return transacao
   }
}