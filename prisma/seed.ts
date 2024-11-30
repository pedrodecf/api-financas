import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const primsa = new PrismaClient()

async function main() {
   const password = await hash('123456', 6)

   const user = await primsa.usuario.upsert({
      where: {
         email: "test@email.com"
      },
      update: {},
      create: {
         email: "test@email.com",
         nome: "Usuário Teste",
         senha: password,
         transacoes: {
            create: {
               valor: 150,
               tipo: 'Entrada',
               data: new Date(),
               categoria: {
                  create: {
                     nome: "Categoria Test",
                     descricao: "Descrição da categoria",
                     avatar: "https://placehold.co/50",
                     usuario: {
                        connect: {
                           email: "test@email.com"
                        }
                     }
                  }
               },
            }
         }
      }
   })
   console.log({ user })
}
main()
   .then(async () => {
      await primsa.$disconnect()
   })
   .catch(async (e) => {
      console.error(e)
      await primsa.$disconnect()
      process.exit(1)
   })