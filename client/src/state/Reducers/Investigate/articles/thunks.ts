import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ExtractionResult } from "@/lib/schemas/ArticleSchema";
import { pollExtraction } from "@/lib/services/articles/pollExtraction";
import { serverClient } from "@/lib/services/client/serverClient";
import { extractionProgressReceived } from "./actions";

export type QueryNewsApiParams = { query: string; timeout: number };

export const extractArticles = createAsyncThunk<
  ExtractionResult,
  SelectedArticle[],
  { rejectValue: string }
>(
  "investigate/runFirecrawlExtraction",
  async (articles, { signal, dispatch, rejectWithValue, requestId }) => {
    try {
      return await pollExtraction({
        client: serverClient.general.extraction,
        articles,
        signal,
        onProgress: (result) => {
          if (!signal.aborted) {
            dispatch(extractionProgressReceived({ requestId, result }));
          }
        },
      });
    } catch (error) {
      return rejectWithValue(
        signal.aborted
          ? "Extraction canceled by user/navigation"
          : error instanceof Error ? error.message : "Article extraction failed",
      );
    }
  },
  { condition: (articles) => articles.length > 0 },
);
