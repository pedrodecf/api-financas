import { AppError } from './app-error';

export class InternalServerError extends AppError {
   constructor(message?: string) {
      super(message ? message : "Internal Server Error", 404);
   }
}