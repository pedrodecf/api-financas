import { AppError } from './app-error';

export class ConteudoExistenteError extends AppError {
   constructor(message: string) {
      super(message, 409);
   }
}