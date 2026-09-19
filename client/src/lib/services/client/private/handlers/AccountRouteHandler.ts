import { PrivateServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  DeleteAccountResponseSchema,
  DeleteAccountResponseSchemaType,
} from "@/lib/schemas/auth/DeleteAccountResponseSchema";
import { IHttpClient } from "../../http/types";

type LoginCredentials = { email: string; password: string };

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
      DeleteAccountResponseSchema,
      credentials,
    );
  }
}
