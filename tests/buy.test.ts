import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import connect from "../src/utils/db";

const server = app.listen(4000);

const agent = request.agent(app);

describe("Buy endpoint", () => {
  beforeAll(async () => {
    await connect();
  });
  afterAll(() => {
    mongoose.connection.close(true);
    server.close();
  });
  describe("POST /buy", () => {
    // eslint-disable-next-line max-len
    test("should return a 400 status code, user has no a buyer role", async () => {
      const res = await agent
        .post("/buy")
        .set("Cookie", [
          // eslint-disable-next-line max-len
          "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjI0MjAwM2JkYzIzOWZhNzAyMjUxMyIsImlhdCI6MTY3NzA3NDY2MCwiZXhwIjoxNjc3MTYxMDYwfQ.rASeUszI70sQ1jMESxmw24N1fqrdcPJXRif3LUvrRgo",
        ])
        .send({ amount: 1, productId: "63f482f02867847f961eda3f" });

      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe(JSON.stringify({ error: "Only buyers can buy" }));
    });

    test("should return a 401 status code, user not logged in", async () => {
      const res = await agent
        .post("/buy")
        .send({ amount: 1, productId: "63f482f02867847f961eda3f" });

      expect(res.statusCode).toEqual(401);
      // eslint-disable-next-line max-len
      expect(res.text).toBe(
        JSON.stringify({ message: "No authorization token, please login" })
      );
    });
  });
});
