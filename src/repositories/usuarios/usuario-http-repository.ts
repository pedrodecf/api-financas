import { prisma } from "../../lib/prisma";
import { UsuarioRepository } from "./usuario-repository";
import { Prisma, Usuario } from '@prisma/client'

export class UsuarioHttpRepository implements UsuarioRepository {
   async create(data: Prisma.UsuarioUncheckedCreateInput): Promise<Usuario> {
      const usuario = await prisma.usuario.create({ data })
      return usuario
   }

   async findByEmail(email: string): Promise<Usuario | null> {
      const usuario = await prisma.usuario.findUnique({ where: { email } })
      if (!usuario) return null
      return usuario
   }

   async findById(id: string): Promise<Usuario | null> {
      const usuario = await prisma.usuario.findUnique({ where: { id } })
      if (!usuario) return null
      return usuario
   }
}