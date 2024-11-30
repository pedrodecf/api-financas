import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

interface DecodedToken {
   sub: string
   iat: number
   exp: number
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
   }

   const [, token] = authHeader.split(' ');

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      req.user = {
         id: decoded.sub
      }

      return next();
   } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
         return res.status(401).json({ message: 'Token expirado' });
      }

      return res.status(401).json({ message: 'Token inválido' });
   }
}