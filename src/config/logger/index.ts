import winston from 'winston';
import 'winston-daily-rotate-file';
import { Config } from '..';
import fs from 'fs';
import path from 'path';

/**
 * Deletes log folders older than a specified number of days
 * @param daysToKeep - Number of days to retain logs
 */

const days = 15;
const deleteOldLogFolders = (daysToKeep: number): void => {
    const logBaseDir: string = path.join(`logs/${Config.NODE_ENV}`);

    fs.readdir(
        logBaseDir,
        (err: NodeJS.ErrnoException | null, folders: string[]) => {
            if (err) {
                console.error('Error reading log directory:', err);
                return;
            }

            const now: Date = new Date();

            folders.forEach((folder: string) => {
                const match = folder.match(/^(\d{2}-\d{2}-\d{4})$/); // Matches folders like '10-02-2025'
                if (match) {
                    const folderDateStr: string = match[1];
                    const folderDate: Date = new Date(
                        folderDateStr.split('-').reverse().join('-'),
                    ); // Convert DD-MM-YYYY to YYYY-MM-DD
                    const diffDays: number =
                        (now.getTime() - folderDate.getTime()) /
                        (1000 * 60 * 60 * 24);

                    if (diffDays > daysToKeep) {
                        const folderPath: string = path.join(
                            logBaseDir,
                            folder,
                        );
                        fs.rmSync(folderPath, { recursive: true, force: true });
                        console.log(`Deleted old log folder: ${folderPath}`);
                    }
                }
            });
        },
    );
};

// **Delete Logs Before Initialization**
deleteOldLogFolders(days); // Delete logs older than 1 day

// **Create Folder for Today's Logs**
const currentDate: Date = new Date();
const folderName: string = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
const logDirectory: string = path.join(`logs/${Config.NODE_ENV}`, folderName);

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
    console.log(`Created log directory: ${logDirectory}`);
}

// **Define Log Colors**
const colors: Record<string, string> = {
    error: '\x1b[31m', // Red
    warn: '\x1b[33m', // Yellow
    info: '\x1b[34m', // Blue
    debug: '\x1b[35m', // Magenta
    reset: '\x1b[0m', // Reset color
};

/**
 * Function to colorize the full log line
 * @param level - Log level (error, warn, info, debug)
 * @param text - Log message
 * @returns Colorized string
 */
const colorizeText = (level: string, text: string): string => {
    return `${colors[level] || colors.reset}${text}${colors.reset}`;
};

// **Define Log Interface**
interface LogInfo {
    timestamp: string;
    level: string;
    message: string;
    serviceName?: string;
    [key: string]: unknown;
}

// **Console Log Format**
const consoleLogFormat = winston.format.printf((info: unknown) => {
    const { timestamp, level, message, serviceName, ...meta } = info as LogInfo;

    const formattedLog = `timestamp: [${String(timestamp)}], level: [${String(level).toUpperCase()}], serviceName: [${
        typeof serviceName === 'string' ? serviceName : 'unknown-service'
    }], message: [${String(message)}], data: [${JSON.stringify(meta)}]`;

    return colorizeText(level, formattedLog);
});

// **File Log Format**
const fileLogFormat = winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.printf((info: unknown) => {
        const { timestamp, level, message, serviceName, ...meta } =
            info as LogInfo;

        if (`${level.toUpperCase()}` === 'ERROR') {
            return `timestamp: [${timestamp}], level: [${level.toUpperCase()}], serviceName: [${
                typeof serviceName === 'string'
                    ? serviceName
                    : 'unknown-service'
            }], message: [${message}], meta: ${JSON.stringify(meta, null, 2)}\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥      END\n`;
        }

        return `timestamp: [${timestamp}], level: [${level.toUpperCase()}], serviceName: [${
            typeof serviceName === 'string' ? serviceName : 'unknown-service'
        }], message: [${message}], meta: ${JSON.stringify(meta, null, 2)}`;
    }),
);

// **Daily Rotating File Transports**
const dailyRotateTransport = new winston.transports.DailyRotateFile({
    dirname: logDirectory,
    filename: 'combined-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    maxFiles: `${days}+d`,
    level: 'debug',
    format: fileLogFormat,
    silent: Config.NODE_ENV === 'test',
});

const errorRotateTransport = new winston.transports.DailyRotateFile({
    dirname: logDirectory,
    filename: 'error-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    level: 'error',
    format: fileLogFormat,
    silent: Config.NODE_ENV === 'test',
});

// **Logger Instance**
const logger = winston.createLogger({
    level: 'debug',
    defaultMeta: { serviceName: 'own-service' },
    transports: [
        dailyRotateTransport,
        errorRotateTransport,
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                consoleLogFormat,
            ),
            silent: Config.NODE_ENV === 'test',
        }),
    ],
});

export default logger;
