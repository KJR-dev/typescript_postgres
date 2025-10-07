import { NextFunction, Response, Router } from 'express';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import authenticate from '../middlewares/authenticate';
// import { createQueryUserSchema } from "../validators/user-validator";
// import { validateRequest } from "../middlewares/validateRequest";
import { sanitizeXSSMiddleware } from '../middlewares/sanitizeXSS';
import { createManagerSchema } from '../validators/manager-validator';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateUserRequest } from '../types/user';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { UserService } from '../services/UserService';
import logger from '../config/logger';
import { UserController } from '../controllers/UserController';

const managerRouter = Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

managerRouter
    .route('/')
    .post(
        sanitizeXSSMiddleware,
        authenticate,
        canAccess([Roles.ADMIN]),
        validateRequest(createManagerSchema, 'body'),
        async (req: CreateUserRequest, res: Response, next: NextFunction) => {
            await userController.create(req, res, next);
        },
    );

export default managerRouter;
