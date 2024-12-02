import { Prisma, TipoTransacao, Transacao } from "@prisma/client";
import { getPeriodByDates } from "../../lib/get-period-by-dates";
import { TransacoesHttpRepository } from "../../repositories/transacoes/transacoes-http-repository";

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
   constructor(private readonly transacoesRepository: TransacoesHttpRepository) { }

   async execute({ order, pagination, filters }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
      const { orderBy, ordination } = order;
      const { page, quantity } = pagination;
      const { usuarioId, categoriaId, periodoDe, periodoAte, tipo, valorMin, valorMax } = filters;

      const { startDate, endDate } = getPeriodByDates({
         periodoDe,
         periodoAte,
      });

      console.log('startDate', startDate);
      console.log('endDate', endDate);

      const hasRangeValues = !!(valorMin && valorMax);

      const where: Prisma.TransacaoWhereInput = {
         data: {
            gte: startDate,
            lte: endDate,
         },
         usuarioId,
         categoriaId,
         tipo,
         ...(hasRangeValues ? {
            valor: {
               gte: valorMin,
               lte: valorMax,
            },
         } :
            {
               valor: {
                  equals: valorMin
               }
            }),
         deleted_at: null,
      };

      const [totalItems, items] = await this.transacoesRepository.$transaction(async (tx) => {
         return Promise.all([
            this.transacoesRepository.count({ where }, tx),
            this.transacoesRepository.list(
               {
                  where,
                  orderBy: {
                     [orderBy]: ordination,
                  },
                  skip: (page - 1) * quantity,
                  take: quantity,
                  include: {
                     categoria: true,
                  },
               },
               tx
            ),
         ]);
      });

      const pages = Math.ceil(totalItems / quantity);

      return {
         items,
         totalItems,
         pages,
      };
   }
}