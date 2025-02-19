import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from '../utils';
import { User } from '../../src/entity/User';

describe('post /auth/register', () => {
    describe('Happy Parts', () => {
        let connection: DataSource;
        beforeAll(async () => {
            connection = await AppDataSource.initialize();
        });
        beforeEach(async () => {
            await truncateTables(connection);
        });
        afterAll(async () => {
            await connection.destroy();
        });
        it('Should return the 201 status code', async () => {
            //Arrenge
            const userData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'sahooj168@gmail.com',
                password: '1234',
            };

            //Act
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post('/api/v1/web/auth/register').send(userData);

            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
            expect(users[0].password).toBe(userData.password);
        });
    });
    // describe('Sad part', () => {});
});
