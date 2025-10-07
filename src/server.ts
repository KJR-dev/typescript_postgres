import app from './app';
import { Config } from './config';
import { AppDataSource } from './config/data-source';
import logger from './config/logger';

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        app.listen(PORT, () => {
            logger.info(`Server listening at http://localhost:${Config.PORT}`, {
                serviceName: 'Auth-Service',
            });
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
