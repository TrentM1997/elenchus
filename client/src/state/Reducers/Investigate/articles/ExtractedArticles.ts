import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { extractArticles } from "./thunks";
import { extractionProgressReceived } from "./actions";
import type { ArticleExtractionState } from "./types";

interface InitialState {
  articles: ArticleExtractionState;
  currentStory: number;
  reading: boolean;
  paginateLimit: boolean;
  progress: string;
  activeRequestId: string | null;
  dismissedFailureUrls: string[];
}

export type ExtractionProgressToastTypes = Pick<
  InitialState,
  "articles" | "progress"
>;

const initialState: InitialState = {
  articles: { status: "initial" },
  currentStory: 0,
  reading: false,
  paginateLimit: false,
  progress: "",
  activeRequestId: null,
  dismissedFailureUrls: [],
};

export const ExtractedArticleSlice = createSlice({
  name: "readingReducer",
  initialState,
  reducers: {
    closeNotification: (state, action: PayloadAction<string>) => {
      if (!state.dismissedFailureUrls.includes(action.payload)) {
        state.dismissedFailureUrls.push(action.payload);
      }
    },
    incrementStory: (state) => {
      state.currentStory += 1;
    },
    decrementStory: (state) => {
      state.currentStory = Math.max(0, state.currentStory - 1);
    },
    incrementStoryBy: (state, action: PayloadAction<number>) => {
      state.currentStory = Math.max(0, action.payload);
    },
    isReading: (state, action: PayloadAction<boolean>) => {
      state.reading = action.payload;
    },
    resetReadingSlice: () => initialState,
    limitPagination: (state, action: PayloadAction<boolean>) => {
      state.paginateLimit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(extractArticles.pending, (state, action) => {
        state.articles = { status: "pending" };
        state.activeRequestId = action.meta.requestId;
        state.currentStory = 0;
        state.progress = "0/" + action.meta.arg.length;
        state.dismissedFailureUrls = [];
        state.reading = false;
        state.paginateLimit = false;
      })
      .addCase(extractionProgressReceived, (state, action) => {
        if (state.activeRequestId !== action.payload.requestId) return;
        const { retrieved, rejected, progress } = action.payload.result;
        state.progress = progress;
        if (retrieved.length === 0 && rejected.length === 0) return;
        state.articles = {
          status: "partial",
          data: { retrieved, failed: rejected },
        };
        state.currentStory = Math.min(
          state.currentStory,
          Math.max(0, retrieved.length - 1),
        );
      })
      .addCase(extractArticles.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        const { retrieved, rejected, progress } = action.payload;
        const data = { retrieved, failed: rejected };
        state.activeRequestId = null;
        if (retrieved.length > 0 || rejected.length > 0) {
          state.progress = progress;
          state.currentStory = Math.min(
            state.currentStory,
            Math.max(0, retrieved.length - 1),
          );
        }
        if (retrieved.length > 0) {
          state.articles = { status: "ready", data };
        } else if (rejected.length > 0) {
          state.articles = {
            status: "failed",
            data,
            details: "All article extractions failed",
          };
        } else {
          state.articles = {
            status: "error",
            data: "data" in state.articles ? state.articles.data : data,
            details: "Extraction completed without any article results",
          };
        }
      })
      .addCase(extractArticles.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        state.activeRequestId = null;
        state.articles = {
          status: "error",
          data:
            "data" in state.articles
              ? state.articles.data
              : { retrieved: [], failed: [] },
          details: action.meta.aborted
            ? "Extraction canceled by user/navigation"
            : action.payload ||
              action.error.message ||
              "Article extraction failed",
        };
      });
  },
});

export type ExtractedArticleSliceState = ReturnType<
  typeof ExtractedArticleSlice.reducer
>;
export const {
  incrementStory,
  decrementStory,
  incrementStoryBy,
  isReading,
  resetReadingSlice,
  closeNotification,
  limitPagination,
} = ExtractedArticleSlice.actions;
export default ExtractedArticleSlice.reducer;
