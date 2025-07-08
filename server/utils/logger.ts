import { createLogger, format, transports, Logger } from "winston";
import { TransformableInfo } from "logform";
import path from "path";

const { combine, timestamp, printf, colorize } = format;

export class AppLogger {
    private static logger: Logger;

    /**
     * Initializes the logger with file and console transports.
     */
    public static init(logLevel: string = "info"): void {

        const logFormat = printf((info: TransformableInfo) => {
            const { level, message, timestamp } = info;
            return `[${timestamp}] [${level}]: ${message}`;
        });

        AppLogger.logger = createLogger({
            level: logLevel,
            format: combine(timestamp(), logFormat),
            transports: [
                new transports.File({
                    filename: path.join("logs", "error.log"),
                    level: "error",
                }),
                new transports.File({
                    filename: path.join("logs", "application.log"),
                }),
            ],
        });

        // Add console transport in non-production environments
        if (process.env.NODE_ENV !== "production") {
            AppLogger.logger.add(
                new transports.Console({
                    format: combine(colorize(), timestamp(), logFormat),
                })
            );
        }
    }

    public static error(message: string): void {
        AppLogger.logger?.error(message);
    }

    public static warn(message: string): void {
        AppLogger.logger?.warn(message);
    }

    public static info(message: string): void {
        AppLogger.logger?.info(message);
    }

    public static verbose(message: string): void {
        AppLogger.logger?.verbose(message);
    }

    public static debug(message: string): void {
        AppLogger.logger?.debug(message);
    }

    public static silly(message: string): void {
        AppLogger.logger?.silly(message);
    }
}
