import { config } from "dotenv";

export class Config {

  static {
    config();
  }

  static get(key: string): string {
    return process.env[key]!;
  }
}