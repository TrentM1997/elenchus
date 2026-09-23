import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
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
} from "../../../../schemas/InvestigationSchema.js";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import { DbResult } from "../../../types/types.ts";

export type InvestigationSaveResult = DbResult<InvestigationSchemaType>;

export type SavedInvestigationsResult = DbResult<InvestigationSchemaType[]>;

export type InsertableInvestigation =
  Database["public"]["Tables"]["investigations"]["Insert"];

export interface IInvestigationsRepository {
  save(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSaveResult>;
  getSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult>;
  selectById(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSchemaType>>;
}

export class InvestigationsRepository implements IInvestigationsRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  public async getSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    return await this.executeGetSavedInvestigations(user_id);
  }

  public async save(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSaveResult> {
    return await this.executeSave(investigation, user_id);
  }

  public async selectById(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSchemaType>> {
    return await this.executeSelectById(user_id, investigation_id);
  }

  private async executeSelectById(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSchemaType>> {
    const { data, error } = await this.db
      .from("investigations")
      .select()
      .eq("user_id", user_id)
      .eq("id", investigation_id)
      .maybeSingle();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    if (data === null) {
      return {
        ok: false,
        message: "Investigation not found",
      };
    }

    return {
      ok: true,
      data: this.validateInvestigation(data),
    };
  }

  private async executeGetSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    const { data, error } = await this.db
      .from("investigations")
      .select()
      .eq("user_id", user_id)
      .order("created_at");

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.validateInvestigations(data),
    };
  }

  private async executeSave(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSaveResult> {
    const validatedInput = this.validateInvestigationInput(investigation);
    const insertable = this.toInsertableInvestigation(validatedInput, user_id);
    return this.insertInvestigation(insertable);
  }

  private async insertInvestigation(
    investigation: InsertableInvestigation,
  ): Promise<InvestigationSaveResult> {
    const { data, error } = await this.db
      .from("investigations")
      .upsert([investigation])
      .select()
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return { ok: true, data: this.validateInvestigation(data) };
  }

  private toInsertableInvestigation(
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
      sources,
      wikipedia_extracts,
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
      sources: sources,
      wikipedia_extracts: wikipedia_extracts,
    };
  }

  private validateInvestigations(
    results: unknown[],
  ): InvestigationSchemaType[] {
    const investigations = [];

    for (const result of results) {
      const investigation = validateServerOrThrow(InvestigationSchema, result);
      investigations.push(investigation);
    }
    return investigations;
  }

  private validateInvestigation(raw: unknown): InvestigationSchemaType {
    return validateServerOrThrow(InvestigationSchema, raw);
  }

  private validateInvestigationInput(
    investigation: unknown,
  ): PersistInvestigationInputSchemaType {
    return validateOrThrow(PersistInvestigationInputSchema, investigation);
  }
}
