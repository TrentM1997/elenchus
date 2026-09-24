import { Static, TSchema } from "@sinclair/typebox";
import { RequestMethod } from "../errors/ServerRequestError";
import { RequestOptions } from "./requestOptions";
import { RouteConfigDefinition } from "@elenchus/contracts";

export interface IHttpClient {
  request<const R extends RouteConfigDefinition>(
    route: R,
    options: RequestOptions<NoInfer<R>>,
  ): Promise<Static<R["outputSchema"]>>;
}

export type ResponseContext = {
  method: RequestMethod;
  url: string;
  signal?: AbortSignal;
};

export interface IRequestParser {
  validateResponseOrThrow<TResponse extends TSchema>(
    schema: TResponse,
    response: Response,
    context: ResponseContext,
  ): Promise<Static<TResponse>>;
}

export interface IConfigRequestHandler {
  optionsPOST<TBody>(body: TBody | undefined): RequestInit;
  optionsGET(signal: AbortSignal | undefined): RequestInit;
  optionsDELETE(): RequestInit;
}
