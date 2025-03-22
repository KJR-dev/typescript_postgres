import fs from 'fs';
import path from 'path';
import { JwtPayload, sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Config } from '../config';
import { User } from '../entity/User';
import { RefreshToken } from '../entity/RefreshToken';

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer = Buffer.alloc(0);
        privateKey = fs.readFileSync(
            path.join(__dirname, '../../certs/private.pem'),
        );
        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        });
        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN!, {
            algorithm: 'HS256',
            expiresIn: '1h',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        });
        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const MS_IN_YEAR =
            1000 *
            60 *
            60 *
            24 *
            ((new Date().getFullYear() % 4 === 0 &&
                new Date().getFullYear() % 100 !== 0) ||
            new Date().getFullYear() % 400 === 0
                ? 366
                : 365);
        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            expireAt: new Date(Date.now() + MS_IN_YEAR),
        });
        return newRefreshToken;
    }
}
