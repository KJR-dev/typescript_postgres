import app from './app';
import { Config } from './config';
import developmentLogger from './config/logger/developmentLogger';

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => {
            developmentLogger.debug('server running', {
                serviceName: 'own-service',
                data: {
                    name: 'jitendra sahoo',
                },
            });
            developmentLogger.info('server running', {
                serviceName: 'own-service',
            });
            developmentLogger.error('server running', {
                serviceName: 'own-service',
            });
            console.log(`Listening on PORT ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();
