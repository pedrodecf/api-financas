import { Prisma, TipoTransacao, Transacao } from "@prisma/client";
import { getPeriodByDates } from "../../lib/get-period-by-dates";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";

type Order = {
  orderBy: "id" | "data" | "valor";
  ordination: "asc" | "desc";
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
  name?: string;
};

interface ListUseCaseRequest {
  order: Order;
  filters: Filters;
}

interface ListUseCaseResponse {
  items: Transacao[];
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
        name,
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
        descricao: {
          contains: name,
          mode: "insensitive",
        },
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

      const items = await this.transacoesRepository.list(
        {
          where,
          orderBy,
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
            parcelas: true,
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

      const balance = {
        total: items.reduce((acc, item) => {
          return item.tipo === "Entrada" ? acc + item.valor : acc - item.valor;
        }, 0),

        totalEntrada: items.reduce((acc, item) => {
          return item.tipo === "Entrada" ? acc + item.valor : acc;
        }, 0),

        totalSaida: items.reduce((acc, item) => {
          return item.tipo === "Saida" ? acc + item.valor : acc;
        }, 0),
      };

      return {
        items,
        balance,
      };
    });
  }
}
