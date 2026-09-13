import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import type { FeedbackReqSchemaType } from "../../../../schemas/FeedbackReqSchema";

export type FeedbackSubmitResult =
  | { ok: true }
  | { ok: false; message: string; details: string };

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
    const { error } = await this.db
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

    return {
      ok: true,
    };
  }
}
