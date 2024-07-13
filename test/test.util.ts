import { hash } from "bcryptjs";
import { prismaClient } from "../src/application/database";
import { UserService } from "../src/service/user.service";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        email: "usertest@gmail.com",
        name: "user test",
        password: await hash("test1234", 10),
      },
    });
  }

  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        email: "usertest@gmail.com",
      },
    });
  }

  static async getToken(): Promise<string> {
    return (await UserService.login({
      email: "usertest@gmail.com",
      password: "test1234",
    })).token!;
  }
}
