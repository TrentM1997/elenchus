import { ValidServerRoute } from "@/infra/transport/types/routeDefinitions";
import { validateOrThrow } from "@/infra/transport/validation/validateOrThrow";
import { Static, TSchema } from "@sinclair/typebox";

export interface IHttpClient {
  get<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
  ): Promise<Static<TResponse>>;

  post<TResponse extends TSchema, TBody>(
    url: ValidServerRoute,
    body: TBody,
    schema: TResponse,
  ): Promise<Static<TResponse>>;

  delete<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
  ): Promise<Static<TResponse>>;
}

export class HttpClient implements IHttpClient {
  public async get<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
  ): Promise<Static<TResponse>> {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`GET ${url} failed with status ${response.status}`);
    }

    const result: unknown = await response.json();

    return validateOrThrow(schema, result);
  }

  public async post<TResponse extends TSchema, TBody>(
    url: ValidServerRoute,
    body: TBody,
    schema: TResponse,
  ): Promise<Static<TResponse>> {
    const request = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!request.ok) {
      throw new Error(`POST ${url} failed with status ${request.status}`);
    }

    const result: unknown = await request.json();

    return validateOrThrow(schema, result);
  }

  public async delete<TResponse extends TSchema>(
    url: ValidServerRoute,
    schema: TResponse,
  ): Promise<Static<TResponse>> {
    const request = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    if (!request.ok) {
      throw new Error(`DELETE ${url} failed with status ${request.status}`);
    }

    const result: unknown = await request.json();

    return validateOrThrow(schema, result);
  }
}
