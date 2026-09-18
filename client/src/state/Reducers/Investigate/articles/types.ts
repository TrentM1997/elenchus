import { ArticleSchemaType } from "@/lib/schemas/ArticleSchema";
import { FailedAttempt } from "@/lib/services/types";

export type ExtractionData = {
  retrieved: ArticleSchemaType[];
  failed: FailedAttempt[];
};

export type ArticleExtractionState =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "partial"; data: ExtractionData }
  | { status: "ready"; data: ExtractionData }
  | { status: "failed"; data: ExtractionData; details: string }
  | { status: "error"; data: ExtractionData; details: string };

export type JobStatus = "pending" | "fulfilled" | "rejected";

export type Prog = "extraction complete" | string;
