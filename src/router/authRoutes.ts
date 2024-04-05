import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/auth/register', authController.handleCreate);
authRouter.post('/auth/login', authController.handleLogin);
authRouter.get('/auth/me', authController.handleVerify);
authRouter.post('/refresh', authController.handleRefresh);

export { authRouter };
