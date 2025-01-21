import { Prisma, TipoTransacao, Transacao } from "@prisma/client";
import { getPeriodByDates } from "../../lib/get-period-by-dates";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";

type Order = {
  orderBy: "id" | "data" | "valor";
  ordination: "asc" | "desc";
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
  pages: number;
  items: Transacao[];
  totalItems: number;
  balance: {
    total: number;
    totalEntrada: number;
    totalSaida: number;
  };
}

export class ListUseCase {
  constructor(private readonly transacoesRepository: TransacoesRepository) {}

  async execute({
    order,
    pagination,
    filters,
  }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
    return await this.transacoesRepository.$transaction(async (tx) => {
      const {
        usuarioId,
        categoriaId,
        periodoDe,
        periodoAte,
        tipo,
        valor,
        valorMin,
        valorMax,
      } = filters;

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
        ...(hasRangeValues
          ? {
              valor: {
                gte: valorMin,
                lte: valorMax,
              },
            }
          : {}),
        ...(aboveSuchValue
          ? {
              valor: {
                gte: valorMin,
              },
            }
          : {}),
        ...(belowSuchValue
          ? {
              valor: {
                lte: valorMax,
              },
            }
          : {}),
        ...(exactValue
          ? {
              valor,
            }
          : {}),
        ...(hasRangeDates
          ? {
              data: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {}),
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
            cartaoCredito: true,
            categoriaId: true,
            custoFixo: true,
            categoria: {
              select: {
                id: true,
                nome: true,
                avatar: true,
                hex: true,
              },
            },
          },
        },
        tx
      );

      const allItemsPeriod = await this.transacoesRepository.list({
        where: {
          usuarioId,
          data: { gte: startDate, lte: endDate },
          deleted_at: null,
        },
        select: {
          tipo: true,
          custoFixo: true,
          cartaoCredito: true,
          valor: true,
        },
      });

      const totalItems = await this.transacoesRepository.count({ where }, tx);

      const pages = Math.ceil(totalItems / pagination.quantity);

      const balance = {
        total: allItemsPeriod.reduce((acc, item) => {
          return item.tipo === "Entrada" ? acc + item.valor : acc - item.valor;
        }, 0),

        totalEntrada: allItemsPeriod.reduce((acc, item) => {
          return item.tipo === "Entrada" ? acc + item.valor : acc;
        }, 0),

        totalSaida: allItemsPeriod.reduce((acc, item) => {
          return item.tipo === "Saida" ? acc + item.valor : acc;
        }, 0),
      };

      return {
        pages,
        items,
        totalItems,
        balance,
      };
    });
  }
}
