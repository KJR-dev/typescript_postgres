import request from 'supertest';
import app from '../../src/app';
import logger from '../../src/config/logger';

describe('post /auth/register', () => {
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
            const response = await request(app)
                .post('/api/v1/users')
                .send(userData);
            logger.info('POST /api/v1/users', response);
            //Assert
        });
    });
    // describe('Sad part', () => {});
});
