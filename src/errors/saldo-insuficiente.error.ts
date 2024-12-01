import { AppError } from './app-error';

export class SaldoInsuficienteError extends AppError {
   constructor() {
      super('Saldo insuficiente', 401);
   }
}