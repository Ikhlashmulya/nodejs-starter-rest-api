import { NextFunction, Request, Response } from "express";
import { UserLoginRequest, UserRegisterRequest } from "../model/user.model";
import { UserService } from "../service/user.service";
import { UserRequest } from "../type/user.request";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as UserRegisterRequest;

      const response = await UserService.register(request);

      return res.json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as UserLoginRequest;

      const response = await UserService.login(request);

      return res.json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static current(req: UserRequest, res: Response, next: NextFunction) {
    const response = UserService.get(req.user!);

    return res.json({
      data: response,
    });
  }
}
