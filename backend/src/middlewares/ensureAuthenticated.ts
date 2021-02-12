import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface tokenPayload {
    iat: number;
    exp: number;
    sub: string;
}
//fica entre as rotas
export default function ensureAuthentiicated(request: Request, response: Response, next: NextFunction): void {

    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decode = verify(token, authConfig.jwt.secret);
        // console.log(decode)
        const { sub } = decode as tokenPayload;
        // console.log(sub)

        //@types/express.d.ts
        request.user = {     //ADICIONANDO O ID DO USUÁRIO NAS REQUISIÇÕES NAS ROTAS Q SÃO AUTENTICADAS
            id: sub,
        };

        // console.log(request.user.id)

        return next(); // continuar usando aplicação

    } catch (err) {

        throw new AppError('Invalid JWT token', 401);
    }


}