import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import createJWKSMock from 'mock-jwks';

describe('POST /auth/self', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Happy Parts', () => {
        it('should return the 200 status code', async () => {
            //Arrenge

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/api/v1/web/auth/self')
                .send();

            //Asserts
            expect(response.statusCode).toBe(200);
        });

        it('Should return user data', async () => {
            const userData = {
                firstName: 'Jitendra',
                lastName: 'sahoo',
                email: 'sahooj168@gmail.com',
                password: '1234',
            };

            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();

            expect((response.body as Record<string, string>).id).toBe(data.id);
        });
    });
});
