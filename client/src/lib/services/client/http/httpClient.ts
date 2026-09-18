import { ValidServerRoute } from "@/infra/transport/types/routeDefinitions";
import { Static, TSchema } from "@sinclair/typebox";
import { ServerRequestError } from "../errors/ServerRequestError";
import {
  IConfigRequestHandler,
  IHttpClient,
  IRequestParser,
  ResponseContext,
} from "./types";

export class HttpClient implements IHttpClient {
  constructor(
    private readonly parser: IRequestParser,
    private readonly configure: IConfigRequestHandler,
  ) {}

  public async get<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
    signal?: AbortSignal,
  ): Promise<Static<TResponse>> {
    const options = this.configure.optionsGET(signal);

    let response: Response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      throw this.handleAndWrapError({
        method: "GET",
        url,
        error,
        signal,
      });
    }

    if (!response.ok) {
      throw new ServerRequestError(
        `GET ${url} failed with status ${response.status}`,
        {
          kind: "http",
          method: "GET",
          url,
          status: response.status,
        },
      );
    }
    return await this.parser.validateResponseOrThrow(schema, response, {
      method: "GET",
      url,
      signal,
    });
  }

  public async post<TResponse extends TSchema, TBody>(
    url: ValidServerRoute,
    schema: TResponse,
    body?: TBody,
    signal?: AbortSignal,
  ): Promise<Static<TResponse>> {
    const options = { ...this.configure.optionsPOST(body), signal };

    let response: Response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      throw this.handleAndWrapError({
        method: "POST",
        url,
        error,
        signal,
      });
    }

    if (!response.ok) {
      throw new ServerRequestError(
        `POST ${url} failed with status ${response.status}`,
        {
          kind: "http",
          method: "POST",
          url,
          status: response.status,
        },
      );
    }

    return await this.parser.validateResponseOrThrow(schema, response, {
      method: "POST",
      url,
      signal,
    });
  }

  public async delete<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
  ): Promise<Static<TResponse>> {
    const options = this.configure.optionsDELETE();
    let response: Response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      throw this.handleAndWrapError({
        method: "DELETE",
        url,
        error,
      });
    }

    if (!response.ok) {
      throw new ServerRequestError(
        `DELETE ${url} failed with status ${response.status}`,
        {
          kind: "http",
          method: "DELETE",
          url,
          status: response.status,
        },
      );
    }

    return await this.parser.validateResponseOrThrow(schema, response, {
      method: "DELETE",
      url,
    });
  }

  private handleAndWrapError(
    context: ResponseContext & { error: unknown },
  ): Error {
    const { error, method, url, signal } = context;

    if (signal?.aborted && error === signal.reason) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    if (error instanceof ServerRequestError) {
      return error;
    }

    return new ServerRequestError(
      `${method} ${url} failed due to a network connection issue`,
      {
        kind: "network",
        method,
        url,
      },
      { cause: error },
    );
  }
}
