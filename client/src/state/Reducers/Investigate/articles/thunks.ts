import { createAsyncThunk, GetThunkAPI } from "@reduxjs/toolkit";
import { pollExtraction } from "@/lib/services/articles/pollExtraction";
import { serverClient } from "@/lib/services/client/serverClient";
import { extractionProgressReceived } from "./actions";
import { ExtractionResult } from "@/lib/schemas/articles/ArticleSchema";

export type QueryNewsApiParams = { query: string; timeout: number };

export const extractArticles = createAsyncThunk<
  ExtractionResult,
  SelectedArticle[],
  {
    rejectValue: string;
    state: { investigation: { read: { activeRequestId: string | null } } };
  }
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
          : error instanceof Error
            ? error.message
            : "Article extraction failed",
      );
    }
  },
  {
    condition: (articles, { getState }) =>
      articles.length > 0 &&
      getState().investigation.read.activeRequestId === null,
  },
);

export const searchNewsApi = createAsyncThunk(
  "SearchResults/searchNewsApi",
  async (query: string, { rejectWithValue, signal }) => {
    try {
      return await serverClient.general.integrations.search.articles({
        query,
        signal,
      });
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
