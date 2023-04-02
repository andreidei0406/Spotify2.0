import { ObjectId } from "mongoose";

export class User {
  _id!: ObjectId;
  firstName!: string;
  lastName!: string;
  phoneNumber?: string;
  email!: string;
  password!: string;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
