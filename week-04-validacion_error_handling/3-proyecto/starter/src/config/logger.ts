import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const esProduccion = process.env.NODE_ENV === "production";

const formatoConsola = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

export const logger = winston.createLogger({
  level: esProduccion ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true })),
  transports: [
    new winston.transports.Console({ format: formatoConsola })
  ]
});

// En producción, además de consola, guardamos logs de error en un archivo
if (esProduccion) {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), winston.format.json())
    })
  );
}