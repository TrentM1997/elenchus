import { DeleteAccountResponseSchemaType } from "@elenchus/contracts/schemas/auth/DeleteAccountResponseSchema";
import { IHttpClient } from "../../http/types";
import { PrivateApiContract } from "@elenchus/contracts";

type LoginCredentials = { email: string; password: string };

export interface IAccountRouteHandler {
  deleteAccount(
    credentials: LoginCredentials,
    signal: AbortSignal,
  ): Promise<DeleteAccountResponseSchemaType>;
}

export class AccountRouteHandler implements IAccountRouteHandler {
  constructor(
    private readonly routes: Pick<PrivateApiContract, "account">,
    private readonly http: IHttpClient,
  ) {}

  public async deleteAccount(
    credentials: LoginCredentials,
    signal: AbortSignal,
  ) {
    const route = this.routes.account.delete;
    const options = { body: credentials, signal };
    return await this.http.request(route, options);
  }
}
