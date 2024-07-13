import { User } from "@prisma/client";

export type UserRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  email: string;
  name: string;
  token?: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    email: user.email,
    name: user.name,
  };
}
