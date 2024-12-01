import { Prisma, Usuario } from "@prisma/client";
import { UsuarioRepository } from "./usuario-repository";

export class UsuarioInMemoryRepository implements UsuarioRepository {

   public usuarios: Usuario[] = []

   async create(data: Prisma.UsuarioUncheckedCreateInput): Promise<Usuario> {
      const usuario: Usuario = {
         id: data.id || 'user-id',
         nome: data.nome,
         email: data.email,
         senha: data.senha,
         balanco: data.balanco || 0.0,
         created_at: new Date(),
         updated_at: new Date(),
         deleted_at: null
      }

      this.usuarios.push(usuario)
      return usuario
   }

   async findByEmail(email: string): Promise<Usuario | null> {
      const usuario = this.usuarios.find(usuario => usuario.email === email)
      if (!usuario) return null
      return usuario
   }

   async findById(id: string): Promise<Usuario | null> {
      const usuario = this.usuarios.find(usuario => usuario.id === id)
      if (!usuario) return null
      return usuario
   }

   async updateBalanco(usuario: Usuario, novoBalanco: number, tx?: Prisma.TransactionClient): Promise<Usuario> {
      usuario.balanco = novoBalanco
      return usuario
   }
}