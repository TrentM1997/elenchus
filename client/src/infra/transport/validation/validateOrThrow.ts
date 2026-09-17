import type { Static, TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import {
  ServerRequestError,
  type ServerRequestErrorContext,
} from "@/lib/services/client/errors/ServerRequestError";

type ValidationContext = Pick<
  Extract<ServerRequestErrorContext, { kind: "invalid-response" }>,
  "method" | "url" | "status"
>;

export function validateOrThrow<T extends TSchema>(
  schema: T,
  data: unknown,
  context: ValidationContext,
): Static<T> {
  const validator = TypeCompiler.Compile(schema);

  if (!validator.Check(data)) {
    throw new ServerRequestError(
      "The server returned an unexpected response shape",
      {
        ...context,
        kind: "invalid-response",
        details: [...validator.Errors(data)],
      },
    );
  }

  return data;
}
