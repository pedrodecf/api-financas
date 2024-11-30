import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { register } from '../controllers/usuarios/register';

const usuariosRouter = Router();

usuariosRouter.post('/', asyncHandler(register));

export { usuariosRouter };
