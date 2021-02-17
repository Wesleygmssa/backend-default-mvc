import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/Users';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserSerive {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const checkUserExist = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExist) {
      // service não tem  acesso direto requisição e resposta, será recebido na rota
      throw new AppError('Email address already used by another', 400);
    }

    // gerando hash de senha
    const hasgedPassword = await hash(password, 8);
    const user = usersRepository.create({
      name,
      email,
      password: hasgedPassword,
    });

    // delete user.password;
    await usersRepository.save(user);
    return user;
  }
}

export default CreateUserSerive;
