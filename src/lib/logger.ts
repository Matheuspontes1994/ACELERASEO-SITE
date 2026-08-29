/**
 * Log Centralizer for Acelera SEO
 * This utility handles error reporting and analytics tracking.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogData {
  message: string;
  level: LogLevel;
  context?: any;
  error?: Error | unknown;
  timestamp: string;
}

class Logger {
  private static instance: Logger;
  
  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(data: LogData) {
    const formattedLog = `[${data.timestamp}] [${data.level.toUpperCase()}] ${data.message}`;
    
    if (data.level === 'error') {
      const args: any[] = [formattedLog];
      if (data.error !== undefined) args.push(data.error);
      if (data.context !== undefined) args.push(data.context);
      console.error(...args);
    } else if (data.level === 'warn') {
      const args: any[] = [formattedLog];
      if (data.context !== undefined) args.push(data.context);
      console.warn(...args);
    } else {
      const args: any[] = [formattedLog];
      if (data.context !== undefined) args.push(data.context);
      console.log(...args);
    }
  }

  public info(message: string, context?: any) {
    this.log({
      message,
      level: 'info',
      context,
      timestamp: new Date().toISOString()
    });
  }

  public warn(message: string, context?: any) {
    this.log({
      message,
      level: 'warn',
      context,
      timestamp: new Date().toISOString()
    });
  }

  public error(message: string, error?: Error | unknown, context?: any) {
    this.log({
      message,
      level: 'error',
      error,
      context,
      timestamp: new Date().toISOString()
    });
  }
}

export const logger = Logger.getInstance();
