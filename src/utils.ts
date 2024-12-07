import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const log = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: "error.log" })],
});

export default log;