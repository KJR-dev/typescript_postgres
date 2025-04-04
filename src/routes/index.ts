import { Router } from 'express';
import authRouter from './AuthRouter';

const router = Router();

router.use('/v1/web/auth', authRouter);

export default router;
