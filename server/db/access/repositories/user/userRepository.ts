import { IUserWriteHandler, UserWriteHandler } from "./userWriteHandler.js";
import { UserDataValidator } from "./userDataValidator.js";

export interface IUserRepository {
  readonly write: IUserWriteHandler;
}

export class UserRepository implements IUserRepository {
  private readonly validator: UserDataValidator;
  public readonly write: IUserWriteHandler;
  constructor() {
    this.validator = new UserDataValidator();
    this.write = new UserWriteHandler(this.validator);
  }
}
