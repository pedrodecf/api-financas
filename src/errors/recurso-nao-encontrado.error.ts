import { AppError } from './app-error';

export class RecursoNaoEncontradoError extends AppError {
   constructor(message: string) {
      super(message, 404);
   }
}