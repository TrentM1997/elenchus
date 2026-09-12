import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../types/databaseInterfaces";
import { ISessionHandler, SessionHandler } from "./handlers/sessionHandler";

export interface IAuthenticationService {
  readonly session: ISessionHandler;
}

export class AuthenticationService implements IAuthenticationService {
  public readonly session: ISessionHandler;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.session = new SessionHandler(this.db);
  }
}
