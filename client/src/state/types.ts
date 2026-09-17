import { ArticleSchemaType } from "@/lib/schemas/ArticleSchema";

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

export type ArticleExtractionState =
  | {
      status: "initial";
    }
  | {
      status: "pending";
    }
  | {
      status: "empty";
      message: "Failed to retreive the selected articles";
    }
  | {
      status: "failed";
      details: string;
    }
  | {
      status: "ready";
      data: ArticleSchemaType[];
    }
  | {
      status: "partial";
      data: ArticleSchemaType[];
    };

export type LocalAsyncState<
  T,
  FailureMessage extends string = "Async operation failed",
> =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | { status: "failed"; message: FailureMessage };
