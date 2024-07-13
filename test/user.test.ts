import { describe, expect, it, afterEach } from "@jest/globals";
import request from "supertest";
import { web } from "../src/application/web";
import { UserTest } from "./test.util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be success registered", async () => {
    const response = await request(web).post("/api/users").send({
      email: "usertest@gmail.com",
      name: "user test",
      password: "usertest123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.email).toBe("usertest@gmail.com");
    expect(response.body.data.name).toBe("user test");
  });

  it("should failed because email already exist", async () => {
    await UserTest.create();
    const response = await request(web).post("/api/users").send({
      email: "usertest@gmail.com",
      name: "user test",
      password: "usertest123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBe("email already exist");
  });

  it("should failed because validation error", async () => {
    const response = await request(web).post("/api/users").send({
      email: "usertest@gmail.com",
      name: "",
      password: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContain("validation error");
  });
});

describe("POST /api/users/login", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be success login", async () => {
    await UserTest.create();
    const response = await request(web).post("/api/users/login").send({
      email: "usertest@gmail.com",
      password: "test1234",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.email).toBe("usertest@gmail.com");
    expect(response.body.data.token).toBeDefined();
  });

  it("should be failed because email is wrong", async () => {
    await UserTest.create();
    const response = await request(web).post("/api/users/login").send({
      email: "wrong@gmail.com",
      password: "test1234",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBe("email or password is wrong");
  });

  it("should be failed because password is wrong", async () => {
    await UserTest.create();
    const response = await request(web).post("/api/users/login").send({
      email: "usertest@gmail.com",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBe("email or password is wrong");
  });
});

describe("GET /api/users/me", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be success get current user", async () => {
    await UserTest.create();
    const token = await UserTest.getToken();
    const response = await request(web).get("/api/users/me").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.email).toBe("usertest@gmail.com");
    expect(response.body.data.name).toBe("user test");
  });

  it("should be failed beacuse token is invalid", async () => {
    const response = await request(web).get("/api/users/me").set("Authorization", `invalid token`);

    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBe("token is invalid");
  });
});
