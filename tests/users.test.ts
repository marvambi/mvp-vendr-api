// tests/users.test.ts
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import connect from "../src/utils/db";

const server = app.listen(4000, () => {
  connect()
    .then(() => console.log(`Application started @ URL 3000 🎉`))
    .catch((e) => console.log("Error: ", e));
});

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
});

describe("POST /users", () => {
  describe("when the username or password is missing", () => {
    test("should return a 422 status code", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "marvin@marvin.com" });

      expect(response.statusCode).toBe(422);
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
