import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverClient } from "@/lib/services/client/serverClient";
import { extractionProgressReceived } from "./actions";
import {
  ArticleSchemaType,
  ExtractionResult,
} from "@/lib/schemas/articles/ArticleSchema";

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
      return await serverClient.general.extraction.runExtractionJob({
        articles,
        signal,
        onProgress: (result) => {
          if (!signal.aborted) {
            console.log({ Request: requestId, "Poll Result": result });
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
  async (params: { query: string }, { rejectWithValue, signal }) => {
    const { query } = params;
    try {
      return await serverClient.general.integrations.search.articles({
        query,
        signal,
      });
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Article search failed",
      );
    }
  },
);

export const saveThisArticle = createAsyncThunk(
  "ExtractedArticles/saveThisArticle",
  async (article_id: ArticleSchemaType["id"], thunkAPI) => {
    try {
      return await serverClient.privileged.user.write.bookmark(article_id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);
