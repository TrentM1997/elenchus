import { TypeCompiler } from "@sinclair/typebox/compiler";
import { WikipediaActionErrorSchema } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";

export const actionErrorValidator = TypeCompiler.Compile(
  WikipediaActionErrorSchema,
);
