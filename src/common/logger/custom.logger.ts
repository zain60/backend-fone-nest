import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';
import { LOG_LEVELS, LOG_DIRECTORY, LOG_CONFIG } from 'src/libs/utils/constants/logger.constants';

export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.initializeLogDirectories();
    this.logger = this.createLogger();
  }

  private initializeLogDirectories(): void {
    Object.values(LOG_DIRECTORY).forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  private createLogger(): winston.Logger {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
    );

    return winston.createLogger({
      format: logFormat,
      transports: [
        this.createFileTransport(LOG_LEVELS.ERROR, LOG_DIRECTORY.ERROR),
        this.createFileTransport(LOG_LEVELS.WARN, LOG_DIRECTORY.WARN),
        this.createFileTransport(LOG_LEVELS.INFO, LOG_DIRECTORY.INFO),
        this.createConsoleTransport()
      ]
    });
  }

  private createFileTransport(level: string, dirname: string): winston.transport {
    return new winston.transports.DailyRotateFile({
      dirname,
      filename: `${level}-%DATE%${LOG_CONFIG.FILE_EXTENSION}`,
      datePattern: LOG_CONFIG.DATE_PATTERN,
      level,
      maxFiles: LOG_CONFIG.MAX_FILES
    });
  }

  private createConsoleTransport(): winston.transport {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }
}
