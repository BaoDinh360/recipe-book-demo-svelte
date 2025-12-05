import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { fullFormat } from 'winston-error-format';

const isProdEnv = process.env.NODE_ENV === 'production';

const { combine, timestamp, printf, colorize, json, prettyPrint } = format;

const uppercaseLevel = format((info) => {
    info.level = String(info.level).toUpperCase();
    return info;
});
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let logMsg = `${timestamp} [${level}]: ${message}`;
    // add metadata
    if (Object.keys(metadata).length) {
        logMsg += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return logMsg;
});

const logTransports = [];

const fileTransport = new transports.DailyRotateFile({
    level: 'info',
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '7d',
    format: combine(uppercaseLevel(), timestamp(), json()),
});
logTransports.push(fileTransport);

if(!isProdEnv) {
    // if dev env, add console log
    const consoleTransport = new transports.Console({
        level: 'debug',
        format: combine(
            uppercaseLevel(),
            colorize(),
            timestamp({format: 'HH:mm:ss'}),
            prettyPrint({depth: 5}),
            consoleFormat
        )
    });
    logTransports.push(consoleTransport);
};

// create logger
export const logger = createLogger({
    level: !isProdEnv ? 'debug' : 'info',
    transports: logTransports,
    exitOnError: false
});