import { Router } from 'express';
import { authRouter } from '../router/authRoutes';
import { personRouter } from '../router/personRoutes';


const router = Router();
router.use(authRouter);
router.use(personRouter);

export { router };
