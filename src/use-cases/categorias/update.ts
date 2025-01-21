import { Categoria } from "@prisma/client";
import { NaoAutorizadoError } from "../../errors/nao-autorizado.error";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { validateCategoria } from "../../utils/validate-category";
import { validateUser } from "../../utils/validate-user";

interface UpdateUseCaseRequest {
  id: number;
  usuarioId: string;
  nome: string;
  avatar?: string;
  hex?: string;
}

interface UpdateUseCaseResponse {
  categoria: Categoria;
}

export class UpdateUseCase {
  constructor(
    private readonly categoriasRepository: CategoriasRepository,
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async execute({
    id,
    usuarioId,
    nome,
    avatar,
    hex,
  }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
    return this.categoriasRepository.$transaction(async (tx) => {
      await validateUser({
        usuarioId,
        tx,
        usuarioRepository: this.usuarioRepository,
      });

      const categoria = await validateCategoria({
        categoriaId: id,
        usuarioId,
        tx,
        categoriasRepository: this.categoriasRepository,
      });

      if (categoria.usuarioId !== usuarioId) throw new NaoAutorizadoError();

      const categoriaAtualizada = await this.categoriasRepository.update(
        id,
        {
          nome,
          avatar,
          hex,
        },
        tx
      );

      return {
        categoria: categoriaAtualizada,
      };
    });
  }
}
