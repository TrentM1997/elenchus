import { createAction } from "@reduxjs/toolkit";
import type { ExtractionResult } from "@/lib/schemas/ArticleSchema";

export const extractionProgressReceived = createAction<{
  requestId: string;
  result: ExtractionResult;
}>("readingReducer/extractionProgressReceived");
