import express from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import logger from '../config/logger';

const tenantRouter = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

tenantRouter.route('/').post(async (req, res, next) => {
    await tenantController.create(req, res, next);
});

export default tenantRouter;
