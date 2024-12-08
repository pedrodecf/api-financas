import { AppError } from './app-error';

export class NaoAcessivelError extends AppError {
   constructor(message: string) {
      super(message ? message : "Não é possível fazer isso", 403);
   }
}