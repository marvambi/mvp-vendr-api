// tests/users.test.ts
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';
import connect from '../src/utils/db';

const server = app.listen(4040)
describe("GET /", () => {
  beforeAll(async () => {
    await connect();
  })
  afterAll(() => {
    mongoose.connection.close(true);
    server.close()
  })
  describe("when default user base url is requested", () => {
    // should respond with a 200 status code
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200)
    })
    // should specify json as the content type in the http header.
  })
})
