import { Prisma, TipoTransacao, Transacao } from "@prisma/client";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { prisma } from "../../lib/prisma";
import { getPeriodByYearOrMonth } from "../../lib/get-period-by-year-or-month";
import { TransacoesHttpRepository } from "../../repositories/transacoes/transacoes-http-repository";

type Order = {
   orderBy: 'id' | 'nome' | 'data' | 'valor';
   ordination: 'asc' | 'desc';
};

type Pagination = {
   page: number;
   quantity: number;
};

type Filters = {
   tipo?: TipoTransacao;
   valor?: number;
   valor_filter?: 'equals' | 'gt' | 'lt';
   categoriaId?: number;
   usuarioId: string;
   mes?: number;
   ano?: number;
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

   async execute({
      order,
      pagination,
      filters,
   }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
      return await prisma.$transaction(async (tx) => {
         const { startDate, endDate } = getPeriodByYearOrMonth({
            month: filters.mes,
            year: filters.ano,
         });

         const hasFilterDate = !!(startDate && endDate);

         const where: Prisma.TransacaoWhereInput = {
            ...filters,
            usuarioId: filters.usuarioId,
            categoriaId: filters.categoriaId,
            tipo: filters.tipo,
            valor: filters.valor
               ? { [filters.valor_filter || 'equals']: filters.valor }
               : undefined,
            data: hasFilterDate
               ? {
                  gte: startDate,
                  lte: endDate,
               }
               : undefined,
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
               include: {
                  categoria: true,
               },
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