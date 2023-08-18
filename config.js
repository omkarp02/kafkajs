import { logLevel, Kafka } from "kafkajs"
import winston from "winston"

const toWinstonLogLevel = (level) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return "error";
    case logLevel.WARN:
      return "warn";
    case logLevel.INFO:
      return "info";
    case logLevel.DEBUG:
      return "debug";
  }
};

const WinstonLogCreator = (logLevel) => {

  const logger = winston.createLogger({
    level: toWinstonLogLevel(logLevel),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "log.log" }),
    ],
  });

  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;
    logger.log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    });
  };
};

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
  logLevel: logLevel.INFO,
  logCreator: WinstonLogCreator,
});
