// tests/users.test.ts

import { User } from "../src/models/user.model";

describe("User model", () => {
  it("should have username, password, deposit, and role properties", () => {
    const user = new User("johndoe", "password123", 10, "buyer");
    expect(user.username).toEqual("johndoe");
    expect(user.password).toEqual("password123");
    expect(user.deposit).toEqual(10);
    expect(user.role).toEqual("buyer");
  });
});
