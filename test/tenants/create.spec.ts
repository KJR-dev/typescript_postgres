import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import { Tenant } from '../../src/entity/Tenant';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';

describe('POST /tenants', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
        jwks = createJWKSMock('http://localhost:3000');
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();
        adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });
    });

    afterAll(async () => {
        await connection.destroy();
    });

    afterEach(() => {
        jwks.stop();
    });

    describe('Given all field', () => {
        it('Should return a 201 status code', async () => {
            //Arrenge
            const tenantData = {
                name: 'Puri Store',
                address: 'Puri, Odisha-752001',
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/api/v1/web/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            //Asserts
            expect(response.statusCode).toBe(201);
        });

        it('Should create a tenant in the Database', async () => {
            //Arrenge
            const tenantData = {
                name: 'Puri Store',
                address: 'Puri, Odisha-752001',
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app)
                .post('/api/v1/web/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenantsRepository = connection.getRepository(Tenant);
            const tenant = await tenantsRepository.find();

            //Asserts
            expect(tenant).toHaveLength(1);
            expect(tenant[0].name).toBe(tenantData.name);
            expect(tenant[0].address).toBe(tenantData.address);
        });

        it('Should return 401 if user is not authenticated', async () => {
            //Arrenge
            const tenantData = {
                name: 'Puri Store',
                address: 'Puri, Odisha-752001',
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/api/v1/web/tenants')
                .send(tenantData);

            const tenantsRepository = connection.getRepository(Tenant);
            const tenants = await tenantsRepository.find();

            //Asserts
            expect(response.statusCode).toBe(401);

            expect(tenants).toHaveLength(0);
        });

        it('Should return 403 if user is not an admin', async () => {
            //Arrenge
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            });

            const tenantData = {
                name: 'Puri Store',
                address: 'Puri, Odisha-752001',
            };

            //Action
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/api/v1/web/tenants')
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(tenantData);

            const tenantsRepository = connection.getRepository(Tenant);
            const tenants = await tenantsRepository.find();

            //Asserts
            expect(response.statusCode).toBe(403);
            expect(tenants).toHaveLength(0);
        });
    });
});
