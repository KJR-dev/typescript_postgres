import { Router } from 'express';
import authRouter from './AuthRouter';
import tenantRouter from './TenantRouter';
import userRouter from './UserRouter';
import managerRouter from './ManagerRouter';

const router = Router();

router.use('/v1/web/auth', authRouter);
router.use('/v1/web/tenants', tenantRouter);
router.use('/v1/web/user', userRouter);
router.use('/v1/web/manager', managerRouter);

export default router;
