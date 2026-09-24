import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import type { FeedbackReqSchemaType } from "@elenchus/contracts/schemas/auth/FeedbackSchema";
import { DbResult } from "../../../types/types.ts";

export type FeedbackSubmitResult = DbResult<string>;
export interface IFeedbackRespository {
  submit(feedback: FeedbackReqSchemaType): Promise<FeedbackSubmitResult>;
}

export class FeedbackRepository implements IFeedbackRespository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  public async submit(
    feedback: FeedbackReqSchemaType,
  ): Promise<FeedbackSubmitResult> {
    return await this.executeSubmit(feedback);
  }

  private async executeSubmit(
    feedback: FeedbackReqSchemaType,
  ): Promise<FeedbackSubmitResult> {
    const { error, data } = await this.db
      .from("user_feedback")
      .insert({ email: feedback.email, message: feedback.message })
      .select()
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    if (!data.id) {
      return {
        ok: false,
        message: "Failed to persist user feedback",
      };
    }

    return {
      ok: true,
      data: data.created_at,
    };
  }
}
