/* eslint-disable prettier/prettier */
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticate from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

const createUserService = new CreateUserService();

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const user = await createUserService.execute({ name, email, password });

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticate,
    upload.single('avatar'),
    async (request, response) => {
        // console.log(request.file);

        const updateUserAvatarService = new UpdateUserAvatarService();
        // R. User
        const user = await updateUserAvatarService.execute({
            user_id: request.user.id, // global no request
            avatarFileName: request.file.filename, // codigo da imagem
        });

        // delete user.password;

        return response.json(user);
    },
);

export default usersRouter;
