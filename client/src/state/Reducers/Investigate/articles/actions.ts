import { ExtractionResult } from "@/lib/schemas/articles/ArticleSchema";
import { createAction } from "@reduxjs/toolkit";

export const extractionProgressReceived = createAction<{
  requestId: string;
  result: ExtractionResult;
}>("readingReducer/extractionProgressReceived");
