import app from './app';
import { Config } from './config';
import logger from './config/logger';

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => {
            // logger.debug('server running', {
            //     serviceName: 'own-service',
            //     data: {
            //         name: 'jitendra sahoo',
            //     },
            // });
            logger.info(`Server listening at http://localhost:${Config.PORT}`, {
                serviceName: 'own-service',
            });
            // logger.error('server running', {
            //     serviceName: 'own-service',
            // });
            console.log(`Listening on PORT ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();
