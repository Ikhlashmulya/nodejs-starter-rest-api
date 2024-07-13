import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user.request";
import { ResponseError } from "../error/response.error";
import { JwtPayload, verify } from "jsonwebtoken";
import { Config } from "../application/config";
import { User } from "@prisma/client";

interface UserToken extends JwtPayload {
  user: User;
}

export function authMiddleware(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerToken = req.get("Authorization") || "";
    if (bearerToken.split(" ")[0] !== "Bearer") {
      throw new ResponseError(401, "token is invalid");
    }

    const jwtToken = bearerToken.split(" ")[1];

    const decodedToken = verify(
      jwtToken,
      Config.get("JWT_SECRET")
    ) as UserToken;

    req.user = decodedToken.user;
    next();
  } catch (e) {
    next(e);
  }
}
