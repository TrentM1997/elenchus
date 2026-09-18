import { ValidServerRoute } from "@/infra/transport/types/routeDefinitions";
import { Static, TSchema } from "@sinclair/typebox";
import { RequestMethod } from "../errors/ServerRequestError";

export interface IHttpClient {
  get<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
    signal?: AbortSignal,
  ): Promise<Static<TResponse>>;

  post<TResponse extends TSchema, TBody>(
    url: ValidServerRoute,
    schema: TResponse,
    body?: TBody,
    signal?: AbortSignal,
  ): Promise<Static<TResponse>>;

  delete<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
  ): Promise<Static<TResponse>>;
}

export type ResponseContext = {
  method: RequestMethod;
  url: ValidServerRoute;
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
