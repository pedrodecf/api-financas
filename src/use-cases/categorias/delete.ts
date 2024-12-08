import { Categoria } from "@prisma/client";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { RecursoNaoEncontradoError } from "../../errors/recurso-nao-encontrado.error";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { NaoAcessivelError } from "../../errors/nao-acessivel.error";

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
      private readonly transacoesRepository: TransacoesRepository
   ) { }

   async execute({
      id,
      usuarioId
   }: DeleteUseCaseRequest): Promise<DeleteUseCaseResponse> {
      return this.categoriasRepository.$transaction(async (tx) => {
         const usuario = await this.usuariosRepository.findById(usuarioId, tx);
         if (!usuario) throw new RecursoNaoEncontradoError('Usuário não encontrado')

         const categoriaToBeDeleted = await this.categoriasRepository.findById(id, usuarioId, tx);
         if (!categoriaToBeDeleted) throw new RecursoNaoEncontradoError('Categoria não encontrada');

         const haveAnyTransaction = await this.transacoesRepository.findByCategoriaId(id, usuarioId, tx);
         if (haveAnyTransaction) throw new NaoAcessivelError('Não é possível deletar uma categoria que possui transações associadas');

         const categoria = await this.categoriasRepository.delete(id, tx);

         return {
            categoria
         }
      })
   }
}