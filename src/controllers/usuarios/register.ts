import z from "zod";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { RegisterUseCase } from "../../use-cases/usuarios/register";
import { RequestHandler } from "express-serve-static-core";

export const register: RequestHandler = async (req, res, next) => {
   const registerBodySchema = z.object({
      nome: z.string(),
      email: z.string().email(),
      senha: z.string().min(6)
   })

   try {
      const { nome, email, senha } = registerBodySchema.parse(req.body)

      const usuarioRepository = new UsuarioHttpRepository()
      const registerUseCase = new RegisterUseCase(usuarioRepository)

      const { usuario } = await registerUseCase.execute({ nome, email, senha })

      res.status(201).json(usuario);
   } catch (error) {
      next(error)
   }
}