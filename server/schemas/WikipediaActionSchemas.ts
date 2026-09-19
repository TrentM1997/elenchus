import { TypeCompiler } from "@sinclair/typebox/compiler";
import { WikipediaActionErrorSchema } from "./WikipediaSchemas.js";

export const actionErrorValidator = TypeCompiler.Compile(
  WikipediaActionErrorSchema,
);
