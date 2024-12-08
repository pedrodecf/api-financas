import { Prisma, TipoTransacao, Transacao } from "@prisma/client";
import { getPeriodByDates } from "../../lib/get-period-by-dates";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";

type Order = {
   orderBy: 'id' | 'data' | 'valor';
   ordination: 'asc' | 'desc';
};

type Pagination = {
   page: number;
   quantity: number;
};

type Filters = {
   tipo?: TipoTransacao;
   valor?: number;
   valorMin?: number;
   valorMax?: number;
   categoriaId?: number;
   usuarioId: string;
   periodoDe?: string;
   periodoAte?: string;
};

interface ListUseCaseRequest {
   order: Order;
   pagination: Pagination;
   filters: Filters;
}

interface ListUseCaseResponse {
   pages: number
   items: Transacao[]
   totalItems: number
}

export class ListUseCase {
   constructor(private readonly transacoesRepository: TransacoesRepository) { }

   async execute({ order, pagination, filters }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
      return await this.transacoesRepository.$transaction(async (tx) => {
         const { usuarioId, categoriaId, periodoDe, periodoAte, tipo, valor, valorMin, valorMax } = filters;

         const { startDate, endDate } = getPeriodByDates({
            periodoDe,
            periodoAte,
         });

         const hasRangeDates = !!(periodoDe && periodoAte);
         const hasRangeValues = !!(valorMin && valorMax && !valor);
         const aboveSuchValue = !!(valorMin && !valorMax && !valor);
         const belowSuchValue = !!(valorMax && !valorMin && !valor);
         const exactValue = !!(valor && !valorMin && !valorMax);

         const where: Prisma.TransacaoWhereInput = {
            usuarioId,
            categoriaId,
            tipo,
            ...(hasRangeValues ? {
               valor: {
                  gte: valorMin,
                  lte: valorMax,
               },
            } : {}),
            ...(aboveSuchValue ? {
               valor: {
                  gte: valorMin,
               },
            } : {}),
            ...(belowSuchValue ? {
               valor: {
                  lte: valorMax,
               },
            } : {}),
            ...(exactValue ? {
               valor,
            } : {}),
            ...(hasRangeDates ? {
               data: {
                  gte: startDate,
                  lte: endDate,
               },
            } : {}),
            deleted_at: null,
         };

         const orderBy: Prisma.TransacaoOrderByWithRelationInput = {
            [order.orderBy]: order.ordination,
         };

         const skip = (pagination.page - 1) * pagination.quantity;
         const take = pagination.quantity;

         const items = await this.transacoesRepository.list(
            {
               where,
               orderBy,
               skip,
               take,
               select: {
                  id: true,
                  data: true,
                  valor: true,
                  tipo: true,
                  usuarioId: true,
                  descricao: true,
                  deleted_at: true,
                  categoria: {
                     select: {
                        id: true,
                        nome: true,
                     }
                  }
               }
            },
            tx
         );

         const totalItems = await this.transacoesRepository.count({ where }, tx);

         const pages = Math.ceil(totalItems / pagination.quantity);

         return {
            pages,
            items,
            totalItems,
         };
      })
   }
}