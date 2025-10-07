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
                password: 'Jitu@1234',
                role: 'admin',
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post('/api/v1/web/auth/register').send(userData);

            //Asserts
            const userRepository = connection.getRepository(User);
            const user = await userRepository
                .createQueryBuilder('user')
                .addSelect('user.password') // explicitly include password
                .where('user.email = :email', { email: userData.email })
                .getOne();

            expect(user).not.toBeNull(); // user exists

            const credentialService = new CredentialService(); // Create an instance
            const result = await credentialService.comparePassword(
                userData.password,
                user!.password,
            );

            expect(result).toBe(true);
        });
    });
});
