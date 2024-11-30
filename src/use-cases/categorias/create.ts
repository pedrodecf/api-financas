import { Categoria } from "@prisma/client";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { ConteudoExistenteError } from "../../errors/conteudo-existente.error";

interface CreateUseCaseRequest {
   nome: string
   avatar?: string
   usuarioId: string
}

interface CreateUseCaseResponse {
   categoria: Categoria
}

export class CreateUseCase {
   constructor(private readonly categoriasRepository: CategoriasHttpRepository) { }

   async execute({
      nome,
      avatar,
      usuarioId
   }: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
      const categoriaWithSameName = await this.categoriasRepository.findByName(nome, usuarioId)

      if (categoriaWithSameName) {
         throw new ConteudoExistenteError('Já existe uma categoria com esse nome')
      }

      const categoria = await this.categoriasRepository.create({
         nome,
         avatar,
         usuarioId
      })

      return {
         categoria
      }
   }
}