import { TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { ClientError } from "../errors/ClientError.js";
import { Static } from "@sinclair/typebox";
import { ServerError } from "../errors/ServerError.js";

function validateOrThrow<T extends TSchema>(
  schema: T,
  data: unknown,
): Static<T> {
  const validator = TypeCompiler.Compile(schema);

  const isValid = validator.Check(data);

  if (!isValid) {
    const details = [...validator.Errors(data)];

    throw new ClientError("Invalid Schema", details, 400);
  }

  return data;
}

export function validateServerOrThrow<T extends TSchema>(
  schema: T,
  data: unknown,
): Static<T> {
  const validator = TypeCompiler.Compile(schema);

  const isValid = validator.Check(data);

  if (!isValid) {
    const details = [...validator.Errors(data)];

    throw new ServerError("Invalid Schema", 500, details);
  }

  return data;
}
export { validateOrThrow };
