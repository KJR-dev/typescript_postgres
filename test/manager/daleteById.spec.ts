import createJWKSMock from 'mock-jwks';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import request from 'supertest';
import { Roles } from '../../src/constants';
import { User } from '../../src/entity/User';

describe('GET /manager/:id', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:3000');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
        adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Happy Parts', () => {
        it('should return the 201 status code', async () => {
            //Arrenge
            const userData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'saho6oj168@gmail.com',
                password: 'Jitu@135050',
                role: 'manager',
                tenantId: 1,
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/api/v1/web/manager')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find({
                where: {
                    role: 'manager',
                },
            });

            //Asserts
            expect(response.statusCode).toBe(201);
            expect(users.length).toBeGreaterThanOrEqual(1);
        });

        it('should return the 200 status code', async () => {
            //Arrenge
            const managerData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'saho6oj168@gmail.com',
                password: 'Jitu@135050',
                role: 'manager',
                tenantId: 1,
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const newData = await request(app)
                .post('/api/v1/web/manager')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(managerData);

            const { id } = newData.body as { id: number };

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .delete(`/api/v1/web/manager/${id}`)
                .set('Cookie', [`accessToken=${adminToken}`])
                .query({ role: 'manager' });

            expect(response.statusCode).toBe(204);
        });

        it('should return the 401 status code', async () => {
            //Arrenge
            const managerData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'saho6oj168@gmail.com',
                password: 'Jitu@135050',
                role: 'manager',
                tenantId: 1,
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const newData = await request(app)
                .post('/api/v1/web/manager')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(managerData);

            const { id } = newData.body as { id: number };

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .delete(`/api/v1/web/manager/${id}`)
                .query({ role: 'manager' });

            expect(response.statusCode).toBe(401);
        });

        it('should return the 403 status code', async () => {
            //Arrenge
            const managerData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'saho6oj168@gmail.com',
                password: 'Jitu@135050',
                role: 'manager',
                tenantId: 1,
            };

            const customerToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            });

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const newData = await request(app)
                .post('/api/v1/web/manager')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(managerData);

            const { id } = newData.body as { id: number };

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .delete(`/api/v1/web/manager/${id}`)
                .set('Cookie', [`accessToken=${customerToken}`])
                .query({ role: 'manager' });

            expect(response.statusCode).toBe(403);
        });

        it('should return the 400 status code', async () => {
            //Arrenge
            const managerData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'saho6oj168@gmail.com',
                password: 'Jitu@135050',
                role: 'manager',
                tenantId: 1,
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app)
                .post('/api/v1/web/manager')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(managerData);

            const id = 'gh';

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .delete(`/api/v1/web/manager/${id}`)
                .set('Cookie', [`accessToken=${adminToken}`])
                .query({ role: 'manager' });

            expect(response.statusCode).toBe(400);
        });
    });
});
