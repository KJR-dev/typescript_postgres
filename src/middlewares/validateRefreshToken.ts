import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { Request } from 'express';
import { AuthCookie, IRefreshTokenPayload } from '../types';
import logger from '../config/logger';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';

export default expressjwt({
    secret: Config.REFRESH_TOKEN!,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
    async isRevoked(request: Request, token) {
        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    id: Number((token?.payload as IRefreshTokenPayload).id),
                    user: { id: Number(token?.payload.sub) },
                },
            });
            return refreshToken === null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            logger.error('Error while getting the refresh token', {
                id: (token?.payload as IRefreshTokenPayload).id,
            });
        }
        return true;
    },
});
