import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import { Tenant } from '../../src/entity/Tenant';
// import { Tenant } from '../../src/entity/Tenant';

describe('POST /tenants', () => {
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
            await request(app).post('/tenants').send(tenantData);

            const tenantsRepository = connection.getRepository(Tenant);
            const tenant = await tenantsRepository.find();

            //Asserts
            expect(tenant).toHaveLength(1);
            expect(tenant[0].name).toBe(tenantData.name);
            expect(tenant[0].address).toBe(tenantData.address);
        });
    });
});
