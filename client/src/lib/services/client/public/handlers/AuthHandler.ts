import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../../httpClient";
import { LoginCredentials } from "@/lib/services/auth/clientAuthService";
import {
  AuthTokenResponsePasswordSchema,
  AuthTokenResponsePasswordType,
  CreateUserResponseSchema,
  CreateUserResponseSchemaType,
  LogOutResultSchema,
  LogOutResultSchemaType,
  RecoverSessionResponseSchema,
  RecoverSessionResponseSchemaType,
} from "@/lib/schemas/AuthSchemas";

export interface IAuthRouteHandler {
  login(credentials: LoginCredentials): Promise<AuthTokenResponsePasswordType>;
  logOut(): Promise<LogOutResultSchemaType>;
  recover(): Promise<RecoverSessionResponseSchemaType>;
  signup(credentials: LoginCredentials): Promise<CreateUserResponseSchemaType>;
}

export class AuthRouteHandler implements IAuthRouteHandler {
  constructor(
    private readonly routes: Pick<PublicServerClientRoutes, "auth">,
    private readonly http: IHttpClient,
  ) {}

  public async login(
    credentials: LoginCredentials,
  ): Promise<AuthTokenResponsePasswordType> {
    return await this.http.post(
      this.routes.auth.login,
      credentials,
      AuthTokenResponsePasswordSchema,
    );
  }

  public async logOut(): Promise<LogOutResultSchemaType> {
    return await this.http.get(this.routes.auth.logOut, LogOutResultSchema);
  }

  public async recover(): Promise<RecoverSessionResponseSchemaType> {
    return await this.http.get(
      this.routes.auth.recover,
      RecoverSessionResponseSchema,
    );
  }

  public async signup(
    credentials: LoginCredentials,
  ): Promise<CreateUserResponseSchemaType> {
    return await this.http.post(
      this.routes.auth.signUp,
      credentials,
      CreateUserResponseSchema,
    );
  }
}
