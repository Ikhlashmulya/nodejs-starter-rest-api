import winston from "winston";
import { Config } from "./config";

export const logger = winston.createLogger({
  level: Config.get("LOG_LEVEL"),
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
