import { ArticleSchemaType } from "@/lib/schemas/ArticleSchema";
import { FailedAttempt } from "@/lib/services/types";

export type AsyncState<T, TEmptyMessage extends string = "No data found"> =
  | {
      status: "initial";
    }
  | {
      status: "pending";
    }
  | {
      status: "empty";
      message: TEmptyMessage;
    }
  | {
      status: "failed";
      details: string;
    }
  | {
      status: "ready";
      data: T;
    };
