export class User {
  email: string;
  username: string;
  password: string;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
