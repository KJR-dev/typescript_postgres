import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import registerValidator from '../validators/register-validator';

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

authRouter
    .route('/register')
    .post(
        registerValidator,
        (req: Request, res: Response, next: NextFunction) =>
            authController.register(req, res, next),
    );

export default authRouter;
