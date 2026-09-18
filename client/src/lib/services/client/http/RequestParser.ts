import { validateOrThrow } from "@/infra/transport/validation/validateOrThrow";
import { Static, TSchema } from "@sinclair/typebox";
import { ServerRequestError } from "../errors/ServerRequestError";
import { IRequestParser, ResponseContext } from "./types";
import {
  HttpSuccessSchema,
  HttpSuccessSchemaType,
} from "@/lib/schemas/api/HttpSuccessSchema";

export class RequestParser implements IRequestParser {
  public async validateResponseOrThrow<TResponse extends TSchema>(
    schema: TResponse,
    response: Response,
    context: ResponseContext,
  ): Promise<Static<TResponse>> {
    return await this.executeValidateResponseOrThrow(schema, response, context);
  }

  private async executeValidateResponseOrThrow<TResponse extends TSchema>(
    schema: TResponse,
    response: Response,
    context: ResponseContext,
  ): Promise<Static<TResponse>> {
    const result = await this.parseResponse(response, context);

    return this.validateResult(schema, result?.data, response.status, {
      method: context.method,
      url: context.url,
    });
  }

  private async parseResponse(
    response: Response,
    context: ResponseContext,
  ): Promise<HttpSuccessSchemaType | undefined> {
    if (response.status === 204) {
      return undefined;
    } else {
      const json = await this.parseJson(response, context);
      return this.validateJsonPayload(json, response.status, context);
    }
  }

  private async parseJson(
    response: Response,
    context: ResponseContext,
  ): Promise<unknown> {
    try {
      return await response.json();
    } catch (error) {
      if (context.signal?.aborted && error === context.signal.reason) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      throw new ServerRequestError(
        "The server returned an unparseable body",
        {
          kind: "invalid-json",
          ...context,
          status: response.status,
        },
        { cause: error },
      );
    }
  }

  private validateJsonPayload(
    json: unknown,
    status: number,
    context: ResponseContext,
  ): HttpSuccessSchemaType {
    return validateOrThrow(HttpSuccessSchema, json, {
      method: context.method,
      url: context.url,
      status: status,
    });
  }

  private validateResult<TResponse extends TSchema>(
    schema: TResponse,
    result: unknown,
    status: number,
    context: ResponseContext,
  ): Static<TResponse> {
    return validateOrThrow(schema, result, {
      method: context.method,
      url: context.url,
      status,
    });
  }
}
