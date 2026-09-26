import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import type { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import {
  InvestigationSourceSchemaType,
  InvestigationSourceSchema,
} from "@elenchus/contracts/schemas/investigations/InvestigationSourceSchema";
import { validateServerOrThrow } from "../../../../core/validation/validateOrThrow.js";
import { DbResult } from "../../../types/types.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export interface IInvestigationSourcesRepository {
  readonly select: IInvestigationSourceSelector;
  readonly write: IInvestigationSourcesWriter;
}

export class InvestigationSourcesRepository implements IInvestigationSourcesRepository {
  private readonly validator: IInvestigationSourceValidator;
  public readonly select: IInvestigationSourceSelector;
  public readonly write: IInvestigationSourcesWriter;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.validator = new InvestigationSourceValidator();
    this.select = new InvestigationSourceSelector(this.db, this.validator);
    this.write = new InvestigationSourcesWriter(this.db, this.validator);
  }
}

interface IInvestigationSourcesWriter {
  saveInvestigationSources(
    payload: Array<{
      article_id: ArticleSchemaType["id"];
      investigation_id: InvestigationSchemaType["id"];
    }>,
  ): Promise<DbResult<InvestigationSourceSchemaType[]>>;
}

class InvestigationSourcesWriter implements IInvestigationSourcesWriter {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly validator: IInvestigationSourceValidator,
  ) {}

  public async saveInvestigationSources(
    payload: Array<{
      article_id: ArticleSchemaType["id"];
      investigation_id: InvestigationSchemaType["id"];
    }>,
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    return this.executeSaveSources(payload);
  }

  private async executeSaveSources(
    payload: Array<{
      article_id: ArticleSchemaType["id"];
      investigation_id: InvestigationSchemaType["id"];
    }>,
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    const { data, error } = await this.db
      .from("investigation_sources")
      .insert(payload)
      .select();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.validator.validateSources(data),
    };
  }
}

interface IInvestigationSourceSelector {
  byInvestigationId(
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>>;
}

class InvestigationSourceSelector implements IInvestigationSourceSelector {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly validator: IInvestigationSourceValidator,
  ) {}

  public async byInvestigationId(
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    return await this.executeByInvestigationId(id);
  }

  private async executeByInvestigationId(
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    const { data, error } = await this.db
      .from("investigation_sources")
      .select()
      .eq("investigation_id", id);

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.validator.validateSources(data),
    };
  }
}

interface IInvestigationSourceValidator {
  validateSources(results: unknown[]): InvestigationSourceSchemaType[];
}

class InvestigationSourceValidator implements IInvestigationSourceValidator {
  public validateSources(results: unknown[]): InvestigationSourceSchemaType[] {
    const sources = [];

    for (const source of results) {
      const validSource = validateServerOrThrow(
        InvestigationSourceSchema,
        source,
      );
      sources.push(validSource);
    }
    return sources;
  }
}
