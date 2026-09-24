import { DeleteAccountResponseSchemaType } from "@elenchus/contracts/schemas/auth/DeleteAccountResponseSchema";
import { IHttpClient } from "../../http/types";
import { PrivateApiContract } from "@elenchus/contracts";

type LoginCredentials = { email: string; password: string };

export interface IAccountRouteHandler {
  deleteAccount(
    credentials: LoginCredentials,
  ): Promise<DeleteAccountResponseSchemaType>;
}

export class AccountRouteHandler implements IAccountRouteHandler {
  constructor(
    private readonly routes: Pick<PrivateApiContract, "account">,
    private readonly http: Pick<IHttpClient, "request">,
  ) {}

  public async deleteAccount(
    credentials: LoginCredentials,
  ): Promise<DeleteAccountResponseSchemaType> {
    const route = this.routes.account.delete;

    return await this.http.request(route, { body: credentials });
  }
}
