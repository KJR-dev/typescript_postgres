import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import registerValidator from '../validators/register-validator';
import { RefreshToken } from '../entity/RefreshToken';
import { TokenService } from '../services/TokenService';
import loginValidator from '../validators/login-validator';
import { CredentialService } from '../services/CredentialService';
import authenticate from '../middlewares/authenticate';
import { AuthRequest } from '../types';

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

authRouter
    .route('/register')
    .post(
        registerValidator,
        (req: Request, res: Response, next: NextFunction) =>
            authController.register(req, res, next),
    );
authRouter
    .route('/login')
    .post(loginValidator, (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
    );

authRouter
    .route('/self')
    .post(authenticate, (req: Request, res: Response, next: NextFunction) =>
        authController.self(req as AuthRequest, res, next),
    );

export default authRouter;
