import { AppError } from './app-error';

export class NaoAutorizadoError extends AppError {
   constructor(message?: string) {
      super(message ? message : "Não autorizado", 409);
   }
}