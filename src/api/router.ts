import { Router } from 'express';
import { authRouter } from '../router/authRoutes';
import { personRouter } from '../router/personRoutes';
import addressesRouter from '../router/addressesRoutes';
import { ensureAuth } from '../middlewares/ensureAuth';
import { userRouter } from '../router/userRoutes';


const router = Router();
router.use(authRouter);
router.use(personRouter, ensureAuth);
router.use(addressesRouter, ensureAuth);
router.use(userRouter, ensureAuth);

export { router };
