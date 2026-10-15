import "@elenchus/contracts/schemas/typeBoxFormats";
import type { Static, TSchema } from "@sinclair/typebox";
import { TypeCompiler, TypeCheck } from "@sinclair/typebox/compiler";
import {
  ServerRequestError,
  type ServerRequestErrorContext,
} from "@/lib/services/client/errors/ServerRequestError";

const validatorCache = new WeakMap<TSchema, TypeCheck<TSchema>>();

type ValidationContext = Pick<
  Extract<ServerRequestErrorContext, { kind: "invalid-response" }>,
  "method" | "url" | "status"
>;

export function validateOrThrow<T extends TSchema>(
  schema: T,
  data: unknown,
  context: ValidationContext,
): Static<T> {
  let validator = validatorCache.get(schema);

  if (!validator) {
    validator = TypeCompiler.Compile(schema);
    validatorCache.set(schema, validator);
  }

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

  return data as Static<T>;
}
