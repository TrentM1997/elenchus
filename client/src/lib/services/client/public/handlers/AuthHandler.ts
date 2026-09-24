import type { PublicApiContract } from "@elenchus/contracts";
import {
  CreateUserResponseSchemaType,
  LoginResponseSchemaType,
  LogOutResultSchemaType,
  RecoverSessionResponseSchemaType,
  ResetPasswordResponseSchemaType,
} from "@elenchus/contracts/schemas/auth/AuthSchemas";
import { IHttpClient } from "../../http/types";

export type LoginCredentials = { email: string; password: string };

export interface IAuthRouteHandler {
  login(credentials: LoginCredentials): Promise<LoginResponseSchemaType>;
  logOut(): Promise<LogOutResultSchemaType>;
  recover(): Promise<RecoverSessionResponseSchemaType>;
  signup(credentials: LoginCredentials): Promise<CreateUserResponseSchemaType>;
  resetPassword(
    credentials: LoginCredentials,
  ): Promise<ResetPasswordResponseSchemaType>;
}

export class AuthRouteHandler implements IAuthRouteHandler {
  constructor(
    private readonly routes: Pick<PublicApiContract, "auth" | "user">,
    private readonly http: Pick<IHttpClient, "request">,
  ) {}

  public async login(credentials: LoginCredentials) {
    const route = this.routes.auth.login;

    return await this.http.request(route, { body: credentials });
  }

  public async logOut() {
    const route = this.routes.auth.logOut;

    return await this.http.request(route, {});
  }

  public async recover() {
    const route = this.routes.auth.recover;

    return await this.http.request(route, {});
  }

  public async signup(credentials: LoginCredentials) {
    const route = this.routes.auth.signUp;

    return await this.http.request(route, { body: credentials });
  }

  public async resetPassword(credentials: LoginCredentials) {
    const route = this.routes.user.passwordReset;

    return await this.http.request(route, { body: credentials });
  }
}
