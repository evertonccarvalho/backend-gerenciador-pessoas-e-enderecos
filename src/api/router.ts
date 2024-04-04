import { Router } from 'express';
import { authRouter } from '../router/authRoutes';
import { personRouter } from '../router/personRoutes';
import addressesRouter from '../router/addressesRoutes';


const router = Router();
router.use(authRouter);
router.use(personRouter);
router.use(addressesRouter);

export { router };
