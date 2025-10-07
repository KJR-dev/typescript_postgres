import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import { registerSchema } from '../validators/register-validator';
import { RefreshToken } from '../entity/RefreshToken';
import { TokenService } from '../services/TokenService';
import { authSchema } from '../validators/login-validator';
import { CredentialService } from '../services/CredentialService';
import authenticate from '../middlewares/authenticate';
import { AuthRequest } from '../types/auth';
import validateRefreshToken from '../middlewares/validateRefreshToken';
import parseRefreshToken from '../middlewares/parseRefreshToken';
import { sanitizeXSSMiddleware } from '../middlewares/sanitizeXSS';
import { validateRequest } from '../middlewares/validateRequest';

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
        sanitizeXSSMiddleware,
        validateRequest(registerSchema, 'body'),
        (req: Request, res: Response, next: NextFunction) =>
            authController.register(req, res, next),
    );
authRouter
    .route('/login')
    .post(
        sanitizeXSSMiddleware,
        validateRequest(authSchema, 'body'),
        (req: Request, res: Response, next: NextFunction) =>
            authController.login(req, res, next),
    );

authRouter
    .route('/self')
    .get(authenticate, (req: Request, res: Response, next: NextFunction) =>
        authController.self(req as AuthRequest, res, next),
    );

authRouter
    .route('/refresh')
    .post(
        validateRefreshToken,
        (req: Request, res: Response, next: NextFunction) =>
            authController.refresh(req as AuthRequest, res, next),
    );

authRouter
    .route('/logout')
    .post(
        authenticate,
        parseRefreshToken,
        (req: Request, res: Response, next: NextFunction) =>
            authController.logout(req as AuthRequest, res, next),
    );
export default authRouter;
