// tests/users.test.ts
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import connect from "../src/utils/db";

const server = app.listen(4000);

describe("GET /", () => {
  beforeAll(async () => {
    await connect();
  });
  afterAll(() => {
    mongoose.connection.close(true);
    server.close();
  });
  describe("when default user base url is requested", () => {
    // should respond with a 200 status code
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);
    });
    // should specify json as the content type in the http header.
  });

  describe("GET /users", () => {
    // should respond with a 200 status code
    test("should return a 401 status code given no access token", async () => {
      const response = await request(app).get("/users");

      expect(response.statusCode).toBe(401);
      // eslint-disable-next-line max-len
      expect(response.text).toBeDefined();
    });
  });

  describe("GET /users", () => {
    // should respond with a 200 status code
    test("should return a 200 status code given an access token", async () => {
      const response = await request(app).get("/users").set("Cookie", [
        // eslint-disable-next-line max-len
        "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjI0MjAwM2JkYzIzOWZhNzAyMjUxMyIsImlhdCI6MTY3NzA3NDY2MCwiZXhwIjoxNjc3MTYxMDYwfQ.rASeUszI70sQ1jMESxmw24N1fqrdcPJXRif3LUvrRgo",
      ]);

      expect(response.statusCode).toBe(200);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      // eslint-disable-next-line max-len
      expect(response.text).toBeDefined();
    });
  });
});

describe("POST /users", () => {
  beforeAll(async () => {
    await connect();
  });
  afterAll(() => {
    mongoose.connection.close(true);
    server.close();
  });
  describe("when any of email, username password or role,  is missing", () => {
    test("should return a 422 status code", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "marvin@marvin.com", password: "MarvinK" });

      expect(response.statusCode).toBe(422);
    });
  });

  describe("when passed email, username password and role, to /users", () => {
    test("should return a 500 status code no live database", async () => {
      const response = await request(app).post("/users").send({
        email: "mike@marvin.com",
        password: "MarvinKK",
        username: "candidate",
        role: "buyer",
        enabled: "true",
      });

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe("Server encountered an error");
    });
  });

  describe("when the username or password is missing for login route", () => {
    test("should return a 400 status code", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "marvin@marvin.com" });

      expect(response.statusCode).toBe(400);
      expect(response.text).toEqual(`\"Please add email and password\"`);
    });
  });

  describe("when username and password is passed to login route", () => {
    test("should return a 400 status code", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "marvin@marvin.com", password: "MarvinAmbrose" });

      expect(response.statusCode).toBe(500);
      expect(response.text).toEqual("Server encountered an error");
    });
  });

  describe("when passed a username and password", () => {
    // eslint-disable-next-line max-len
    test("should specify json as the content type in the http header", async () => {
      const response = await request(app).post("/users").send({
        username: "username",
        password: "password",
      });

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});
