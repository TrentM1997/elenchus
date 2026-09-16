import { PrivateServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../../httpClient";
import { LoginCredentials } from "@/lib/services/auth/clientAuthService";
import {
  DeleteAccountResponseSchema,
  DeleteAccountResponseSchemaType,
} from "@/lib/schemas/DeleteAccountResponseSchema";

export interface IAccountRouteHandler {
  deleteAccount(
    credentials: LoginCredentials,
  ): Promise<DeleteAccountResponseSchemaType>;
}

export class AccountRouteHandler implements IAccountRouteHandler {
  constructor(
    private readonly routes: Pick<PrivateServerClientRoutes, "account">,
    private readonly http: Pick<IHttpClient, "post">,
  ) {}

  public async deleteAccount(
    credentials: LoginCredentials,
  ): Promise<DeleteAccountResponseSchemaType> {
    return await this.http.post(
      this.routes.account.delete,
      credentials,
      DeleteAccountResponseSchema,
    );
  }
}
