import { Static, TSchema } from "@sinclair/typebox";
import { ServerRequestError } from "../errors/ServerRequestError";
import type { RouteConfigDefinition } from "@elenchus/contracts";
import type { RequestOptions } from "./requestOptions";
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

  public async request<const R extends RouteConfigDefinition>(
    route: R,
    url: string,
    options: RequestOptions<NoInfer<R>>,
  ): Promise<Static<R["outputSchema"]>> {
    const { body, signal } = options;
    signal?.throwIfAborted();
    const { outputSchema: schema, method } = route;

    switch (method) {
      case "GET":
        return this.get(url, schema, signal);
      case "POST":
        return this.post(url, schema, body, signal);
      case "DELETE":
        return this.delete(url, schema, signal);
      default:
        throw new TypeError(`Unsupported HTTP method: ${method}`);
    }
  }

  private async get<TResponse extends TSchema>(
    url: string,
    schema: TResponse,
    signal?: AbortSignal,
  ): Promise<Static<TResponse>> {
    return this.sendRequest(url, schema, {
      ...this.configure.optionsGET(signal),
      method: "GET",
    });
  }

  private async post<TResponse extends TSchema, TBody>(
    url: string,
    schema: TResponse,
    body?: TBody,
    signal?: AbortSignal,
  ): Promise<Static<TResponse>> {
    return this.sendRequest(url, schema, {
      ...this.configure.optionsPOST(body),
      method: "POST",
      signal,
    });
  }

  private async delete<TResponse extends TSchema>(
    url: string,
    schema: TResponse,
    signal?: AbortSignal,
  ): Promise<Static<TResponse>> {
    const options = this.configure.optionsDELETE();
    return this.sendRequest(url, schema, {
      ...options,
      method: "DELETE",
      signal,
    });
  }

  private async sendRequest<TResponse extends TSchema>(
    url: string,
    schema: TResponse,
    options: RequestInit & { method: ResponseContext["method"] },
  ): Promise<Static<TResponse>> {
    const context: ResponseContext = {
      method: options.method,
      url,
      signal: options.signal ?? undefined,
    };
    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      throw this.handleAndWrapError({ ...context, error });
    }
    if (!response.ok) {
      throw new ServerRequestError(
        `${options.method} ${url} failed with status ${response.status}`,
        { ...context, kind: "http", status: response.status },
      );
    }
    return this.parser.validateResponseOrThrow(schema, response, context);
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
