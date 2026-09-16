import { TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { Static } from "@sinclair/typebox";
import { ClientError } from "../errors/clientError";

export function validateOrThrow<T extends TSchema>(
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
