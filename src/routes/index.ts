import { Router } from 'express';
import authRouter from './AuthRouter';
import tenantRouter from './TenantRouter';

const router = Router();

router.use('/v1/web/auth', authRouter);
router.use('/v1/web/tenants', tenantRouter);

export default router;
