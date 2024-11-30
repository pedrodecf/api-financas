import { AppError } from './app-error';

export class CredenciaisInvalidasError extends AppError {
   constructor() {
      super('E-mail e/ou senha inválido', 401);
   }
}