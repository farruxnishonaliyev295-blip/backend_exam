import winston from "winston";
import "winston-mongodb";

// 🛠 custom format (chiroyli log)
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ""
  }`;
});

// 📦 transportlar
const transports = [
  // 🟢 Console
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      logFormat
    ),
  }),

  // 📄 Error file
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),
      logFormat
    ),
  }),

  // 📄 Combined file
  new winston.transports.File({
    filename: "logs/combined.log",
    format: winston.format.combine(
      winston.format.timestamp(),
      logFormat
    ),
  }),
];

// 🗄 MongoDB logging (faqat env bo‘lsa)
if (process.env.MONGO_URI) {
  transports.push(
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "logs",
      level: "info",
      tryReconnect: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

// 🚀 logger yaratish
export const logger = winston.createLogger({
  level: "info",
  transports,
});

// 🔥 helper functions (qulaylik uchun)
export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

export const logError = (message, meta = {}) => {
  logger.error(message, meta);
};

export const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};