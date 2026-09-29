import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../../../core/validation/validateOrThrow.js";
import {
  InvestigationSchemaType,
  InvestigationSchema,
  PersistInvestigationInputSchema,
  PersistInvestigationInputSchemaType,
  InsertableInvestigationSchemaType,
  SelectedInvestigationPayloadSchemaType,
  SelectedInvestigationPayloadSchema,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";

export interface IInvestigationsRepositoryParser {
  toInsertableInvestigation(
    investigation: PersistInvestigationInputSchemaType,
    user_id: AuthenticatedUserId,
  ): InsertableInvestigationSchemaType;
  validateInvestigations(results: unknown[]): InvestigationSchemaType[];
  validateInvestigation(raw: unknown): InvestigationSchemaType;
  validateInvestigationInput(
    investigation: unknown,
  ): PersistInvestigationInputSchemaType;
  validateSelectedInvestigation(
    result: unknown,
  ): SelectedInvestigationPayloadSchemaType;
}

export class InvestigationsRepositoryParser implements IInvestigationsRepositoryParser {
  public toInsertableInvestigation(
    investigation: PersistInvestigationInputSchemaType,
    user_id: AuthenticatedUserId,
  ): InsertableInvestigationSchemaType {
    const {
      idea,
      initial_perspective,
      premises,
      ending_perspective,
      changed_opinion,
      new_concepts,
      takeaway,
      had_merit,
      biases,
      expertise,
    } = investigation;

    return {
      idea: idea,
      biases: biases,
      expertise: expertise,
      initial_perspective: initial_perspective,
      premises: premises,
      ending_perspective: ending_perspective,
      changed_opinion: changed_opinion,
      new_concepts: new_concepts,
      takeaway: takeaway,
      had_merit: had_merit,
      user_id: user_id,
    };
  }

  public validateInvestigations(results: unknown[]): InvestigationSchemaType[] {
    const investigations = [];

    for (const result of results) {
      const investigation = validateServerOrThrow(InvestigationSchema, result);
      investigations.push(investigation);
    }
    return investigations;
  }

  public validateInvestigation(raw: unknown): InvestigationSchemaType {
    return validateServerOrThrow(InvestigationSchema, raw);
  }

  public validateInvestigationInput(
    investigation: unknown,
  ): PersistInvestigationInputSchemaType {
    return validateOrThrow(PersistInvestigationInputSchema, investigation);
  }

  public validateSelectedInvestigation(
    result: unknown,
  ): SelectedInvestigationPayloadSchemaType {
    return validateServerOrThrow(SelectedInvestigationPayloadSchema, result);
  }
}
