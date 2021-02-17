import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

const authenticateUserService = new AuthenticateUserService();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const { token, user } = await authenticateUserService.execute({
    email,
    password,
  });

  // delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
