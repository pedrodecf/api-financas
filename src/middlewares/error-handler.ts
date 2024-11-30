import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'erro',
      message: 'Erro de validação',
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'erro',
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    status: 'erro',
    message: 'Erro interno do servidor',
  });
}
