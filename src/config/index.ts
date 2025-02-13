import { config } from 'dotenv';

config();

const envFile = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`;

config({ path: envFile });

export const Config = {
    //General
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,

    //PostgreSQL
    POSTGRESQL_HOST: process.env.POSTGRESQL_HOST,
    POSTGRESQL_PORT: Number(process.env.POSTGRESQL_PORT),
    POSTGRESQL_USERNAME: process.env.POSTGRESQL_USERNAME,
    POSTGRESQL_PASSWORD: process.env.POSTGRESQL_PASSWORD,
    POSTGRESQL_DATABASE: process.env.POSTGRESQL_DATABASE,
};
