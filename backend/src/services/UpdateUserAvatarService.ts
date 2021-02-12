import { getRepository } from 'typeorm';
import User from '../models/Users';
import path from 'path';
import uploadConfig from '../config/upload';
import fs from 'fs';
import AppError from '../errors/AppError';

interface Request {
    user_id: string;
    avatarFileName: string;
}
class UpdateUserAvatarService {
    public async execute({ user_id, avatarFileName }: Request): Promise<User> {
        const usersRepository = getRepository(User); // R.pronto

        const user = await usersRepository.findOne(user_id); // user || underfined
        console.log(user)

        if (!user) {
            throw new AppError('Only authenticated users can change avatar', 401);
        }

        if (user.avatar) {
            // deletar avatar anterior
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

            const userAvatarFileExistis = await fs.promises.stat(userAvatarFilePath); //verificar se arq exist

            if (userAvatarFileExistis) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFileName; // atualize a nova foto

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;