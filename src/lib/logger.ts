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
      console.error(formattedLog, data.error, data.context);
      // Aqui poderíamos enviar para Sentry ou Firebase Analytics:
      // logEvent(analytics, 'exception', { description: data.message, ... });
    } else if (data.level === 'warn') {
      console.warn(formattedLog, data.context);
    } else {
      console.log(formattedLog, data.context);
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
