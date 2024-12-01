import { Prisma, Categoria } from "@prisma/client";
import { CategoriasRepository } from "./categorias-repository";

export class CategoriasInMemoryRepository implements CategoriasRepository {
   public categorias: Categoria[] = []

   async create(data: Prisma.CategoriaUncheckedCreateInput): Promise<Categoria> {
      const categoria: Categoria = {
         id: data.id || this.categorias.length + 1,
         nome: data.nome,
         usuarioId: data.usuarioId || '1',
         avatar: data.avatar || 'avatar',
         deleted_at: null,
      }

      this.categorias.push(categoria)
      return categoria
   }

   async findByUsuarioId(usuarioId: string): Promise<Categoria[]> {
      const categorias = this.categorias.filter(categoria => categoria.usuarioId === usuarioId)
      return categorias
   }

   async findByName(nome: string, usuarioId: string): Promise<Categoria | null> {
      const categoria = this.categorias.find(categoria => categoria.nome === nome && categoria.usuarioId === usuarioId)
      if (!categoria) return null
      return categoria
   }

   async findById(id: number, usuarioId: string, tx?: Prisma.TransactionClient): Promise<Categoria | null> {
      const categoria = this.categorias.find(categoria => categoria.id === id && categoria.usuarioId === usuarioId)
      if (!categoria) return null
      return categoria
   }

   async delete(id: number): Promise<Categoria> {
      const categoria = this.categorias.find(categoria => categoria.id === id)
      if (!categoria) throw new Error('Categoria não encontrada')
      categoria.deleted_at = new Date()
      return categoria
   }

   async update(id: number, data: Prisma.CategoriaUncheckedUpdateInput): Promise<Categoria> {
      const categoria = this.categorias.find(categoria => categoria.id === id)
      if (!categoria) throw new Error('Categoria não encontrada')
      categoria.nome = typeof data.nome === 'string' ? data.nome : categoria.nome
      categoria.avatar = typeof data.avatar === 'string' ? data.avatar : categoria.avatar
      return categoria
   }
}