import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { CredentialService } from '../../src/services/CredentialService';

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
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'sahooj168@gmail.com',
                password: '1234',
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post('/api/v1/web/auth/register').send(userData);

            //Asserts
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find({
                where: {
                    email: userData.email,
                },
            });

            expect(users).toHaveLength(1);

            const credentialService = new CredentialService(); // Create an instance
            const result = await credentialService.comparePassword(
                userData.password,
                users[0].password,
            );

            expect(result).toBe(true);
        });
    });
});
