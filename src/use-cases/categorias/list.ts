import { Categoria, Prisma } from "@prisma/client";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";

type Order = {
  orderBy: "id" | "nome" | "transacoes";
  ordination: "asc" | "desc";
};

type Filters = {
  nome?: string;
  usuarioId: string;
  search?: string;
};

interface ListUseCaseRequest {
  order: Order;
  filters: Filters;
}

interface ListUseCaseResponse {
  items: Categoria[];
}

export class ListUseCase {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  async execute({
    order,
    filters,
  }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
    return await this.categoriasRepository.$transaction(async (tx) => {
      const { usuarioId, nome } = filters;

      const where: Prisma.CategoriaWhereInput = {
        usuarioId,
        nome: {
          contains: nome,
          mode: "insensitive",
        },
        deleted_at: null,
      };

      const orderBy: Prisma.CategoriaOrderByWithRelationInput = {
        [order.orderBy]: order.ordination,
      };

      const items = await this.categoriasRepository.list(
        {
          where,
          orderBy,
          include: {
            _count: {
              select: {
                transacoes: {
                  where: {
                    deleted_at: null,
                  },
                },
              },
            },
          },
        },
        tx
      );

      return {
        items,
      };
    });
  }
}
