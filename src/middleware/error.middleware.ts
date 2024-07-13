import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../error/response.error";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";
import { logger } from "../application/logger";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ResponseError) {
    return res.status(err.code).json({
      errors: err.message,
    });
  } else if (err instanceof ZodError) {
    return res.status(400).json({
      errors: `validation error : ${JSON.stringify(err.message)}`,
    });
  } else if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      errors: err.message,
    });
  } else {
    return res.status(500).json({
      errors: err.message,
    });
  }
}
