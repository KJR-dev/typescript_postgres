import winston from 'winston';
import 'winston-daily-rotate-file';
import { Config } from '..';
import fs from 'fs';
import path from 'path';

// Generate folder name based on the current date (DD-MM-YYYY format)
const currentDate = new Date();
const folderName = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
const logDirectory = path.join(`logs/${Config.NODE_ENV}`, folderName);

// Ensure the directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Define log levels for color output
const colors: Record<string, string> = {
    error: '\x1b[31m', // Red
    warn: '\x1b[33m', // Yellow
    info: '\x1b[34m', // Blue
    debug: '\x1b[35m', // Magenta
    reset: '\x1b[0m', // Reset color
};

// Function to colorize the full log line
const colorizeText = (level: string, text: string): string => {
    return `${colors[level] || colors.reset}${text}${colors.reset}`;
};

// Define the interface for log data
interface LogInfo {
    timestamp: string;
    level: string;
    message: string;
    serviceName?: string;
    [key: string]: unknown; // Allow extra metadata
}

// Console log format (with color)
const consoleLogFormat = winston.format.printf((info: unknown) => {
    const { timestamp, level, message, serviceName, ...meta } = info as LogInfo;

    // Ensure proper type safety
    const formattedLog = `timestamp: [${String(timestamp)}], level: [${String(level).toUpperCase()}], serviceName: [${
        typeof serviceName === 'string' ? serviceName : 'unknown-service'
    }], message: [${String(message)}], data: [${JSON.stringify(meta)}]`;

    return colorizeText(level, formattedLog);
});

// File log format (without color)
const fileLogFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
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

// Daily rotating file transports
const dailyRotateTransport = new winston.transports.DailyRotateFile({
    dirname: logDirectory,
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '15d',
    level: 'debug',
    format: fileLogFormat,
    silent: Config.NODE_ENV === 'test',
});

const errorRotateTransport = new winston.transports.DailyRotateFile({
    dirname: logDirectory,
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    format: fileLogFormat,
    silent: Config.NODE_ENV === 'test',
});

// Logger instance
const developmentLogger = winston.createLogger({
    level: 'debug',
    defaultMeta: { serviceName: 'own-service' },
    transports: [
        dailyRotateTransport,
        errorRotateTransport,
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleLogFormat, // Full colored logs for console
            ),
            silent: Config.NODE_ENV === 'test',
        }),
    ],
});

export default developmentLogger;
