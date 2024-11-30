import z from "zod";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { AuthenticateUseCase } from "../../use-cases/usuarios/authenticate";
import { RequestHandler } from "express-serve-static-core";

export const authenticate: RequestHandler = async (req, res, next) => {
   const authenticateBodySchema = z.object({
      email: z.string().email(),
      senha: z.string().min(6)
   })

   try {
      const { email, senha } = authenticateBodySchema.parse(req.body)

      const usuarioRepository = new UsuarioHttpRepository()
      const authenticateUseCase = new AuthenticateUseCase(usuarioRepository)

      const { token } = await authenticateUseCase.execute({ email, senha })

      res.status(201).json({ token });
   } catch (error) {
      next(error)
   }
}