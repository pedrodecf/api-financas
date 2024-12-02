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

   async list(
      params: {
         where?: Prisma.TransacaoWhereInput;
         orderBy?: Prisma.TransacaoOrderByWithRelationInput;
         skip?: number;
         take?: number;
         include?: Prisma.TransacaoInclude;
      },
      tx?: Prisma.TransactionClient
   ): Promise<Transacao[]> {
      let result = [...this.transacoes];

      if (params.where) {
         result = result.filter((transacao) =>
            this.applyWhereFilter(transacao, params.where!)
         );
      }


      if (params.orderBy) {
         result.sort((a, b) => this.applyOrderBy(a, b, params.orderBy!));
      }

      const start = params.skip || 0;
      const end = params.take ? start + params.take : undefined;
      result = result.slice(start, end);

      return result;
   }

   async count(
      params: { where?: Prisma.TransacaoWhereInput },
      tx?: Prisma.TransactionClient
   ): Promise<number> {
      let result = [...this.transacoes];

      if (params.where) {
         result = result.filter((transacao) =>
            this.applyWhereFilter(transacao, params.where!)
         );
      }

      return result.length;
   }

   private applyOrderBy(
      a: Transacao,
      b: Transacao,
      orderBy: Prisma.TransacaoOrderByWithRelationInput
   ): number {
      for (const key in orderBy) {
         const order = (orderBy as any)[key];
         const aValue = (a as any)[key];
         const bValue = (b as any)[key];

         if (aValue < bValue) {
            return order === 'asc' ? -1 : 1;
         } else if (aValue > bValue) {
            return order === 'asc' ? 1 : -1;
         }
      }
      return 0;
   }

   private applyFieldFilter(
      value: any,
      filter: Prisma.IntFilter | Prisma.StringFilter | Prisma.DateTimeFilter | any
   ): boolean {
      for (const op in filter) {
         const filterValue = filter[op];
         switch (op) {
            case 'equals':
               if (value !== filterValue) return false;
               break;
            case 'gt':
               if (!(value > filterValue)) return false;
               break;
            case 'gte':
               if (!(value >= filterValue)) return false;
               break;
            case 'lt':
               if (!(value < filterValue)) return false;
               break;
            case 'lte':
               if (!(value <= filterValue)) return false;
               break;
            case 'contains':
               if (typeof value !== 'string' || !value.includes(filterValue))
                  return false;
               break;
            case 'in':
               if (!Array.isArray(filterValue) || !filterValue.includes(value))
                  return false;
               break;
            default:
               return false;
         }
      }
      return true;
   }

   private applyWhereFilter(
      transacao: Transacao,
      where: Prisma.TransacaoWhereInput
   ): boolean {
      for (const key in where) {
         const value = (where as any)[key];

         if (key === 'AND') {
            if (!Array.isArray(value)) continue;
            return value.every((condition: Prisma.TransacaoWhereInput) =>
               this.applyWhereFilter(transacao, condition)
            );
         } else if (key === 'OR') {
            if (!Array.isArray(value)) continue;
            return value.some((condition: Prisma.TransacaoWhereInput) =>
               this.applyWhereFilter(transacao, condition)
            );
         } else if (key === 'NOT') {
            if (!Array.isArray(value)) continue;
            return !value.some((condition: Prisma.TransacaoWhereInput) =>
               this.applyWhereFilter(transacao, condition)
            );
         } else {
            const transacaoValue = (transacao as any)[key];
            if (typeof value === 'object' && value !== null) {
               if (!this.applyFieldFilter(transacaoValue, value)) {
                  return false;
               }
            } else {
               if (transacaoValue !== value) {
                  return false;
               }
            }
         }
      }
      return true;
   }
}

