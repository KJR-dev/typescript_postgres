import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
// import { truncateTables } from '../utils';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('post /auth/register', () => {
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
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
        it('Should return the 400 status code if email is already exists', async () => {
            //Arrenge
            const userData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: 'sahooj168@gmail.com',
                password: '1234',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            //Act
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/api/v1/web/auth/register')
                .send(userData);

            const users = await userRepository.find();

            //Assert

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });
    describe('Sad part', () => {
        describe('Fields are missing', () => {
            it('should return 400 status code if email field is missing', async () => {
                //Arrenge
                const userData = {
                    firstName: 'Jitendra',
                    lastName: 'Sahoo',
                    email: '',
                    password: '1234',
                };

                //Act
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                const response = await request(app)
                    .post('/api/v1/web/auth/register')
                    .send(userData);

                //Assert
                expect(response.statusCode).toBe(400);
            });
        });
    });
    describe('Sanitizing fields', () => {
        it('should trim the email field', async () => {
            //Arrenge
            const userData = {
                firstName: 'Jitendra',
                lastName: 'Sahoo',
                email: ' sahooj168@gmail.com ',
                password: '1234',
            };

            //Act
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post('/api/v1/web/auth/register').send(userData);

            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe('sahooj168@gmail.com');
        });
    });
});
