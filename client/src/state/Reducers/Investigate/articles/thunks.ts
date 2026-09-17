import { createAsyncThunk } from "@reduxjs/toolkit";
import { getArticles } from "@/lib/services/news/getArticles";
import { FirecrawlSuccessPayload } from "@/lib/services/types";
import {
  appendArticles,
  appendFailures,
  updateProgress,
} from "./ExtractedArticles";
import { ExtractionService } from "@/lib/services/articles/extractionService";
import { serverClient } from "@/lib/services/client/serverClient";
import { ExtractionJobResultSchemaType } from "@/lib/schemas/ArticleSchema";
const extractionService = new ExtractionService(serverClient);

export type QueryNewsApiParams = {
  query: string;
  timeout: number;
};

export const queryNewsApi = createAsyncThunk(
  "/investigation/queryNewsApi",
  async (params: QueryNewsApiParams, thunkAPI) => {
    try {
      const response = await getArticles(
        params.query,
        params.timeout,
        thunkAPI.signal,
      );

      if (!response) {
        throw new Error(`Unable to query endpoint for article links`);
      }
      if (response) {
        return response;
      } else {
        return;
      }
    } catch (error) {
      console.error(error);

      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const extractArticles = createAsyncThunk(
  "investigate/runFirecrawlExtraction",
  async (articles: SelectedArticle[], thunkApi) => {
    const { signal, dispatch, rejectWithValue } = thunkApi;

    try {
      return await extractionService.extractArticles({
        articles,
        signal,
        onProgress: (snapshot) => {
          if (signal.aborted) return;
          if (!snapshot) return;

          if (snapshot.result) {
            dispatch(updateProgress(snapshot.result.progress));
            dispatch(appendArticles(snapshot.result.retrieved));
            dispatch(appendFailures(snapshot.result.rejected));
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
);
