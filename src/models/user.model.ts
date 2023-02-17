// src/models/user.model.ts

export class User {
  constructor(
    public username: string,
    public password: string,
    public deposit: number,
    public role: string
  ) { }
}
