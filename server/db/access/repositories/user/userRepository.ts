import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import { IUserWriteHandler, UserWriteHandler } from "./userWriteHandler";
import { UserDataValidator } from "./userDataValidator";
import { IUserSelectHandler, UserSelectHandler } from "./userSelectHandler";

export interface IUserRepository {
  readonly select: IUserSelectHandler;
  readonly write: IUserWriteHandler;
}

export class UserRepository implements IUserRepository {
  private readonly validator: UserDataValidator;
  public readonly select: IUserSelectHandler;
  public readonly write: IUserWriteHandler;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.validator = new UserDataValidator();
    this.select = new UserSelectHandler(this.db, this.validator);
    this.write = new UserWriteHandler(this.db, this.validator);
  }
}
