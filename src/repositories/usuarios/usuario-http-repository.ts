import { prisma } from "../../lib/prisma";
import { UsuarioRepository } from "./usuario-repository";
import { Prisma, Usuario } from '@prisma/client'

export class UsuarioHttpRepository implements UsuarioRepository {
   async create(
      data: Prisma.UsuarioUncheckedCreateInput,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario> {
      const prismaInstance = tx || prisma
      return prismaInstance.usuario.create({
         data
      })
   }

   async findByEmail(
      email: string,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario | null> {
      const prismaInstance = tx || prisma
      return prismaInstance.usuario.findUnique({
         where: {
            email
         }
      })
   }

   async findById(
      id: string,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario | null> {
      const prismaInstance = tx || prisma
      return prismaInstance.usuario.findUnique({
         where: {
            id
         }
      })
   }

   async updateBalanco(
      usuario: Usuario,
      novoBalanco: number,
      tx?: Prisma.TransactionClient
   ): Promise<Usuario> {
      const prismaInstance = tx || prisma
      return prismaInstance.usuario.update({
         where: {
            id: usuario.id
         },
         data: {
            balanco: novoBalanco
         }
      })
   }
}