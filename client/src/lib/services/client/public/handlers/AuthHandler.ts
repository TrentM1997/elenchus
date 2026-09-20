import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  AuthTokenResponsePasswordSchema,
  AuthTokenResponsePasswordType,
  CreateUserResponseSchema,
  CreateUserResponseSchemaType,
  LoginResponseSchema,
  LoginResponseSchemaType,
  LogOutResultSchema,
  LogOutResultSchemaType,
  RecoverSessionResponseSchema,
  RecoverSessionResponseSchemaType,
  ResetPasswordResponseSchema,
  ResetPasswordResponseSchemaType,
} from "@/lib/schemas/auth/AuthSchemas";
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
    private readonly routes: Pick<PublicServerClientRoutes, "auth" | "user">,
    private readonly http: IHttpClient,
  ) {}

  public async login(
    credentials: LoginCredentials,
  ): Promise<LoginResponseSchemaType> {
    return await this.http.post(
      this.routes.auth.login,
      LoginResponseSchema,
      credentials,
    );
  }

  public async logOut(): Promise<LogOutResultSchemaType> {
    return await this.http.post(this.routes.auth.logOut, LogOutResultSchema);
  }

  public async recover(): Promise<RecoverSessionResponseSchemaType> {
    return await this.http.post(
      this.routes.auth.recover,
      RecoverSessionResponseSchema,
    );
  }

  public async signup(
    credentials: LoginCredentials,
  ): Promise<CreateUserResponseSchemaType> {
    return await this.http.post(
      this.routes.auth.signUp,
      CreateUserResponseSchema,
      credentials,
    );
  }

  public async resetPassword(
    credentials: LoginCredentials,
  ): Promise<ResetPasswordResponseSchemaType> {
    return await this.http.post(
      this.routes.user.passwordReset,
      ResetPasswordResponseSchema,
      credentials,
    );
  }
}
