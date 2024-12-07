"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf } = winston_1.default.format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const log = winston_1.default.createLogger({
    level: "info",
    format: combine(timestamp(), logFormat),
    transports: [new winston_1.default.transports.Console(), new winston_1.default.transports.File({ filename: "error.log" })],
});
exports.default = log;
