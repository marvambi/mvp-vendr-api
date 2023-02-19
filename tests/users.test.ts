// tests/users.test.ts

import { User } from "../src/models/user.model";

describe("User model", () => {
  test("should have username, password, deposit, and role properties", async () => {
    const user = await User.create({ username: "johndoe", email: "johny@jj.com", password: "password123", deposite: 10, role: "buyer" });
    expect(user.username).toEqual("johndoe");
    expect(user.password).toEqual("password123");
    expect(user.deposit).toEqual(10);
    expect(user.role).toEqual("buyer");
  });
});
