import { Router } from 'express';
import userRouter from './UserRoutes';

const router = Router();

router.use('/v1/web', userRouter);

export default router;
