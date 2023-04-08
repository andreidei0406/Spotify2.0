import { User } from '../models/user.model';
import { UserDB } from '../schemas/user.schema';

export interface isLoggedIn {
  status: boolean;
}

export interface logoutStatus {
  success: boolean;
}

export async function postUser(user: User): Promise<Error | User> {
  if (!user) {
    return Error('The parameters given are not valid!');
  }

  try {
    const emailExists = await UserDB.findOne({ email: user.email });
    if (emailExists) {
      return Error('The user added to the database already exists!');
    }
    const phoneNumberExists = await UserDB.findOne({
      phoneNumber: user.phoneNumber,
    });
    if (phoneNumberExists) {
      return Error('The user number added to the database already exists!');
    }
  } catch (ex: any) {
    return ex;
  }

  const NewUser = new UserDB({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    password: user.password,
  });
  NewUser.save();
  return NewUser;
}
