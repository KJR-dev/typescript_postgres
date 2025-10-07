import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '../controllers/UserController';
import { CreateUserRequest, getByIdUserRequest } from '../types/user';
import logger from '../config/logger';
import { AppDataSource } from '../config/data-source';
import { UserService } from '../services/UserService';
import { User } from '../entity/User';
import { validateRequest } from '../middlewares/validateRequest';
import { createUserSchema, getByIdSchema } from '../validators/user-validator';
import { sanitizeXSSMiddleware } from '../middlewares/sanitizeXSS';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

userRouter
    .route('/')
    .post(
        sanitizeXSSMiddleware,
        validateRequest(createUserSchema, 'body'),
        async (req: CreateUserRequest, res: Response, next: NextFunction) => {
            await userController.create(req, res, next);
        },
    )
    .get(
        authenticate,
        canAccess([Roles.ADMIN]),
        async (req: Request, res: Response, next: NextFunction) => {
            await userController.getAll(req, res, next);
        },
    );

userRouter
    .route('/:id')
    .get(
        authenticate,
        canAccess([Roles.ADMIN]),
        validateRequest(getByIdSchema, 'params'),
        async (req: getByIdUserRequest, res: Response, next: NextFunction) => {
            await userController.getById(req, res, next);
        },
    )
    .delete(
        authenticate,
        canAccess([Roles.ADMIN]),
        validateRequest(getByIdSchema, 'params'),
        async (req: getByIdUserRequest, res: Response, next: NextFunction) => {
            await userController.deleteById(req, res, next);
        },
    );

export default userRouter;
