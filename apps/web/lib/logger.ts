/**
 * Logger utility with multiple log levels
 * Set NEXT_PUBLIC_APP_DEBUG=true in .env to enable logging
 */

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
} as const;

type LogLevelType = (typeof LogLevel)[keyof typeof LogLevel];

// Get debug mode from environment
const isDebugEnabled = process.env.NEXT_PUBLIC_APP_DEBUG === "true";
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || "INFO";

const currentLogLevel: LogLevelType =
  LogLevel[logLevel as keyof typeof LogLevel] ?? LogLevel.INFO;

// Colors for different log levels (works in browser console)
const colors = {
  debug: "color: #888",
  info: "color: #2563eb",
  warn: "color: #f59e0b",
  error: "color: #ef4444",
};

function shouldLog(level: LogLevelType): boolean {
  return isDebugEnabled && level >= currentLogLevel;
}

function formatMessage(level: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
}

export function debug(message: string, data?: unknown) {
  if (shouldLog(LogLevel.DEBUG)) {
    const formattedMessage = formatMessage("DEBUG", message);
    if (typeof window !== "undefined") {
      console.log(`%c${formattedMessage}`, colors.debug, data || "");
    } else {
      console.log(formattedMessage, data || "");
    }
  }
}

export function info(message: string, data?: unknown) {
  if (shouldLog(LogLevel.INFO)) {
    const formattedMessage = formatMessage("INFO", message);
    if (typeof window !== "undefined") {
      console.log(`%c${formattedMessage}`, colors.info, data || "");
    } else {
      console.log(formattedMessage, data || "");
    }
  }
}

export function warn(message: string, data?: unknown) {
  if (shouldLog(LogLevel.WARN)) {
    const formattedMessage = formatMessage("WARN", message);
    if (typeof window !== "undefined") {
      console.warn(`%c${formattedMessage}`, colors.warn, data || "");
    } else {
      console.warn(formattedMessage, data || "");
    }
  }
}

export function error(message: string, errorData?: unknown) {
  if (shouldLog(LogLevel.ERROR)) {
    const formattedMessage = formatMessage("ERROR", message);
    const errorDetails =
      errorData instanceof Error
        ? { message: errorData.message, stack: errorData.stack }
        : errorData;

    if (typeof window !== "undefined") {
      console.error(`%c${formattedMessage}`, colors.error, errorDetails || "");
    } else {
      console.error(formattedMessage, errorDetails || "");
    }
  }
}

// Convenience aliases
export const log = info;
export const logError = error;
export const logWarn = warn;
export const logDebug = debug;

// Group logging for complex operations
export function group(label: string, fn: () => void) {
  if (isDebugEnabled) {
    console.group(label);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  } else {
    fn();
  }
}

// Table logging for structured data
export function table(data: unknown) {
  if (isDebugEnabled && console.table) {
    console.table(data);
  }
}

// Performance timing
export function time(label: string): () => void {
  if (!isDebugEnabled) {
    return () => {
      // No-op when debug is disabled
    };
  }

  console.time(label);
  return () => console.timeEnd(label);
}
