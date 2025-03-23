import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
// import { User } from '../../src/entity/User';

describe('POST /auth/login', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Happy Parts', () => {
        it('should login the user', async () => {
            //Arrenge
            const userData = {
                email: 'sahooj168@gmail.com',
                password: '1234',
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post('/api/v1/web/auth/register').send(userData);

            //Asserts
            // const userRepository = connection.getRepository(User);
            // const users = await userRepository.find();
            // expect(users).toHaveLength(1);
        });
    });
});
