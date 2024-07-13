import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const protectedApi = Router();
protectedApi.use(authMiddleware);
protectedApi.get("/api/users/me", UserController.current);
