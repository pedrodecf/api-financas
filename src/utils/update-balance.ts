import { Prisma, TipoTransacao, Usuario } from "@prisma/client"
import { SaldoInsuficienteError } from "../errors/saldo-insuficiente.error"
import { UsuarioRepository } from "../repositories/usuarios/usuario-repository"

interface Props {
   usuario: Usuario
   balanceData: { valor: number, tipo: TipoTransacao }
   tx: Prisma.TransactionClient
   usuariosRepository: UsuarioRepository
   isTipoSaida?: boolean
   saldoOriginalTransacao?: number
}

export async function updateBalance({
   usuario,
   balanceData,
   tx,
   usuariosRepository,
   isTipoSaida = false,
   saldoOriginalTransacao
}: Props): Promise<Usuario> {
   const { valor, tipo } = balanceData

   if (tipo === TipoTransacao.Saida && usuario.balanco < valor && !isTipoSaida) {
      throw new SaldoInsuficienteError()
   }

   if (isTipoSaida && saldoOriginalTransacao) {
      const novoBalanco = usuario.balanco + saldoOriginalTransacao
      if (tipo === TipoTransacao.Saida && novoBalanco < valor) {
         throw new SaldoInsuficienteError()
      }
   }

   const novoBalanco = tipo === TipoTransacao.Entrada
      ? usuario.balanco + valor
      : usuario.balanco - valor

   return usuariosRepository.updateBalanco(
      usuario,
      novoBalanco,
      tx
   )
}