import { AppError } from './app-error';

export class EmailJaCadastradoError extends AppError {
   constructor() {
      super('Email já cadastrado', 409);
   }
}