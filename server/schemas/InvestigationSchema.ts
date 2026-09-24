import { InvestigationSchema } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
export {
  PerspectiveSchema,
  ExpertiseSchema,
  InvestigationSchema,
  type InvestigationSchemaType,
  InsertableInvestigationSchema,
  type InsertableInvestigationSchemaType,
  PersistInvestigationInputSchema,
  type PersistInvestigationInputSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";

export const GetInvestigationSchema = Type.Object({
  user_id: Type.String(),
  investigation_id: Type.Number(),
});

export type GetInvestigationSchemaType = Static<typeof GetInvestigationSchema>;

const validator = TypeCompiler.Compile(InvestigationSchema);

export const validateInvestigation = (investigation: unknown) => {
  const isValid = validator.Check(investigation);
  const details = [...validator.Errors(investigation)];

  return { isValid, details } as const;
};
