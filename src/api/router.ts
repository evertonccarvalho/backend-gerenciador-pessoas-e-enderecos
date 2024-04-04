import { Router } from 'express';
import { authRouter } from '../router/authRoutes';


const router = Router();
router.use(authRouter);


export { router };
