/* eslint-disable @typescript-eslint/naming-convention */
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/Users';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
    email: string;
    password: string;
}

class AuthencateUserService {
    public async execute({
        email,
        password,
    }: Request): Promise<{ token: string; user: User }> {
        const usersRepository = getRepository(User); // todos metodosll

        const user = await usersRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        // user.password = senha criptografada
        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        // gerando token
        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id, // Identificação do usuário que ficara global
            expiresIn: authConfig.jwt.expirenIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthencateUserService;
