import { Categoria, Prisma } from "@prisma/client";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";

type Order = {
   orderBy: 'id' | 'nome' | 'transacoes';
   ordination: 'asc' | 'desc';
}

type Pagination = {
   page: number;
   quantity: number;
}

type Filters = {
   nome?: string;
   usuarioId: string;
   search?: string;
}

interface ListUseCaseRequest {
   order: Order;
   pagination: Pagination;
   filters: Filters;
}

interface ListUseCaseResponse {
   pages: number;
   items: Categoria[];
   totalItems: number;
}

export class ListUseCase {
   constructor(private readonly categoriasRepository: CategoriasRepository) { }

   async execute({ order, pagination, filters }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
      return await this.categoriasRepository.$transaction(async (tx) => {
         const { usuarioId, nome } = filters;

         const where: Prisma.CategoriaWhereInput = {
            usuarioId,
            nome: {
               contains: nome,
               mode: 'insensitive'
            },
            deleted_at: null
         }

         const orderBy: Prisma.CategoriaOrderByWithRelationInput = {
            [order.orderBy]: order.ordination
         };

         const skip = (pagination.page - 1) * pagination.quantity;
         const take = pagination.quantity;

         const items = await this.categoriasRepository.list(
            {
               where,
               orderBy,
               skip,
               take,
               include: {
                  _count: {
                     select: {
                        transacoes: {
                           where: {
                              deleted_at: null
                           }
                        }
                     }
                  }
               }
            },
            tx
         );

         const totalItems = await this.categoriasRepository.count({ where }, tx);
         const pages = Math.ceil(totalItems / pagination.quantity);

         return {
            pages,
            items,
            totalItems
         }
      })
   }
}