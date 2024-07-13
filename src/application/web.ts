import express from "express";
import { publicApi } from "../route/public";
import { errorMiddleware } from "../middleware/error.middleware";
import { protectedApi } from "../route/protected";

export const web = express();
web.use(express.json())
web.use(publicApi);
web.use(protectedApi);
web.use(errorMiddleware);
