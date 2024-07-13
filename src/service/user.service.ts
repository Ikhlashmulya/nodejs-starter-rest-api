import { compare, genSalt, hash } from "bcryptjs";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response.error";
import {
  toUserResponse,
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
} from "../model/user.model";
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";
import { logger } from "../application/logger";
import { sign } from "jsonwebtoken";
import { Config } from "../application/config";
import { User } from "@prisma/client";

export class UserService {
  static async register(request: UserRegisterRequest): Promise<UserResponse> {
    logger.debug(`request: ${request}`);
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserWithSameEmail = await prismaClient.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (totalUserWithSameEmail > 0) {
      throw new ResponseError(400, "email already exist");
    }

    registerRequest.password = await hash(
      registerRequest.password,
      await genSalt(10)
    );

    const user = await prismaClient.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }

  static async login(request: UserLoginRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    const user = await prismaClient.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new ResponseError(401, "email or password is wrong");
    }

    const isPasswordValid = await compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
      throw new ResponseError(401, "email or password is wrong");
    }

    const response = toUserResponse(user);
    response.token = sign(
      { user: user, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      Config.get("JWT_SECRET")
    );

    return response;
  }

  static get(user: User): UserResponse {
    return toUserResponse(user);
  }
}
