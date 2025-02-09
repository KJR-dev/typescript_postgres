import { config } from 'dotenv';

config();

const envFile = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`;

config({ path: envFile });

export const Config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
};
