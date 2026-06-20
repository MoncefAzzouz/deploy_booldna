import winston from "winston";
import { env } from "../config/env.js";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that we want to link the colors
winston.addColors(colors);

// Choose the aspect of your log customizing the log format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports the logger must use to print out messages
const transports = [
  // Console transport
  new winston.transports.Console(),

  // File transport for error logs
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),

  // File transport for all logs
  new winston.transports.File({
    filename: "logs/combined.log",
  }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "warn",
  levels,
  format,
  transports,
});

// Utility functions for different log levels
export const log = {
  error: (message: string, meta?: any) => {
    logger.error(message, meta);
  },

  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },

  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },

  http: (message: string, meta?: any) => {
    logger.http(message, meta);
  },

  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },
};

export default logger;
