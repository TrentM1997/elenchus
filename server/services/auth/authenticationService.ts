import type { IAuthenticationParser } from "./handlers/authenticationParser";
import { AuthenticationParser } from "./handlers/authenticationParser";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../types/databaseInterfaces";
import { ISessionHandler, SessionHandler } from "./handlers/sessionHandler";

export interface IAuthenticationService {
  readonly session: ISessionHandler;
}

export class AuthenticationService implements IAuthenticationService {
  public readonly session: ISessionHandler;
  private readonly parser: IAuthenticationParser;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new AuthenticationParser();
    this.session = new SessionHandler(this.db);
  }
}
