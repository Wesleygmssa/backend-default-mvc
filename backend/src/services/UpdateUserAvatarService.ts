import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/Users';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

/*

* Recebimento das info [x]
* Trativa de error/exessões [x]
* Acesso ao repositorio do TypeORM [x]

*/

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Request {
  user_id: string;
  avatarFileName: string;
}
class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User); // R.pronto

    const user = await usersRepository.findOne(user_id); // user || underfined

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      // deletar avatar anterior
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExistis = await fs.promises.stat(userAvatarFilePath); // verificar se arq exist
      if (userAvatarFileExistis) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName; // update a new photo
    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
