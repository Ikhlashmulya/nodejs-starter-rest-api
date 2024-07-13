import { z } from "zod";

export class UserValidation {
  static readonly REGISTER = z.object({
    email: z.string().email().min(1).max(100),
    password: z.string().min(8).max(255),
    name: z.string().min(1).max(100),
  });

  static readonly LOGIN = z.object({
    email: z.string().email().min(1).max(100),
    password: z.string().min(8).max(255),
  });

  static readonly UPDATE = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).max(255).optional(),
  })
}
