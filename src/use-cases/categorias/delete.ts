import { Categoria } from "@prisma/client";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { RecursoNaoEncontradoError } from "../../errors/recurso-nao-encontrado.error";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";

interface DeleteUseCaseRequest {
   id: number;
   usuarioId: string;
}

interface DeleteUseCaseResponse {
   categoria: Categoria;
}

export class DeleteUseCase {
   constructor(
      private readonly categoriasRepository: CategoriasRepository,
      private readonly usuariosRepository: UsuarioRepository,
   ) { }

   async execute({
      id,
      usuarioId
   }: DeleteUseCaseRequest): Promise<DeleteUseCaseResponse> {
      const usuario = await this.usuariosRepository.findById(usuarioId);

      if (!usuario) {
         throw new RecursoNaoEncontradoError('Usuário não encontrado')
      }

      const categoriaToBeDeleted = await this.categoriasRepository.findById(id, usuarioId);

      if (!categoriaToBeDeleted) {
         throw new RecursoNaoEncontradoError('Categoria não encontrada');
      }

      const categoria = await this.categoriasRepository.delete(id);

      return {
         categoria
      }
   }
}