import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Config } from './index';
import { RefreshToken } from '../entity/RefreshToken';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.POSTGRESQL_HOST,
    port: Number(Config.POSTGRESQL_PORT),
    username: Config.POSTGRESQL_USERNAME,
    password: Config.POSTGRESQL_PASSWORD,
    database: Config.POSTGRESQL_DATABASE,
    // synchronize:
    //     Config.NODE_ENV === 'test' || Config.NODE_ENV === 'development',
    synchronize: true,
    logging: false,
    entities: [User, RefreshToken],
    migrations: [],
    subscribers: [],
});
