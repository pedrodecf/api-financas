import { AppError } from './app-error';

export class NaoAutorizadoError extends AppError {
   constructor() {
      super("Não autorizado", 409);
   }
}