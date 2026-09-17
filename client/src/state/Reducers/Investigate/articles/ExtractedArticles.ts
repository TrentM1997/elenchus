import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FailedAttempt } from "@/lib/services/types";
import { extractArticles } from "./thunks";
import type { ArticleSchemaType } from "../../../../../../schemas/api/types/ArticlesSchema";
import { ArticleExtractionState } from "@/state/types";

interface InitialState {
  articles: ArticleExtractionState;
  failedNotifications: Array<FailedAttempt>;
  currentStory: number;
  reading: boolean;
  paginateLimit: boolean;
  error: string | null;
}

const initialState: InitialState = {
  articles: { status: "initial" },
  failedNotifications: [],
  currentStory: 0,
  reading: false,
  paginateLimit: false,
  error: null,
};

export const ExtractedArticleSlice = createSlice({
  name: "readingReducer",
  initialState: initialState,
  reducers: {
    appendArticles: (state, action: PayloadAction<ArticleSchemaType[]>) => {
      if (
        state.articles.status === "ready" ||
        state.articles.status === "partial"
      ) {
        const nextBatch = action.payload;
        for (const batchItem of nextBatch) {
          const url = batchItem.article_url;
          const already = state.articles.data.find(
            (a) => a.article_url === batchItem.article_url,
          );
          if (!already) {
            state.articles.data.push(batchItem);
          }

          const index = state.failedNotifications.findIndex(
            (f) => f.article_url === url,
          );
          if (index !== -1) {
            state.failedNotifications.splice(index, 1);
          }
        }
      }
    },
    appendFailures: (state, action: PayloadAction<FailedAttempt[]>) => {
      if (
        state.articles.status === "ready" ||
        state.articles.status === "partial"
      ) {
        const nextBatch = action.payload;
        for (const f of nextBatch) {
          const url = f.article_url;
          if (state.articles.data.some((a) => a.article_url === url)) continue;
          if (!state.failedNotifications.some((x) => x.article_url === url)) {
            state.failedNotifications.push(f);
          }
        }
      }
    },
    articleData: (state, action) => {
      state.articles = action.payload;
    },
    rejected: (state, action) => {
      state.failedNotifications = action.payload;
    },
    closeNotification: (state, action) => {
      state.failedNotifications.splice(action.payload, 1);
    },
    incrementStory: (state) => {
      state.currentStory = state.currentStory += 1;
    },
    decrementStory: (state) => {
      state.currentStory -= 1;
    },
    incrementStoryBy: (state, action) => {
      state.currentStory = action.payload;
    },
    isReading: (state, action) => {
      state.reading = action.payload;
    },
    resetReadingSlice: () => initialState,
    limitPagination: (state, action) => {
      state.paginateLimit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(extractArticles.rejected, (state, action) => {
      state.articles = {
        status: "failed",
        details: "Article extraction failed in flight",
      };
      state.error =
        (action.payload as string) || action.error.message || "Unknown error";
    });
  },
});

export type ExtractedArticleSliceState = ReturnType<
  typeof ExtractedArticleSlice.reducer
>;

export const {
  articleData,
  rejected,
  incrementStory,
  decrementStory,
  incrementStoryBy,
  isReading,
  resetReadingSlice,
  closeNotification,
  limitPagination,
  appendArticles,
  appendFailures,
} = ExtractedArticleSlice.actions;

export default ExtractedArticleSlice.reducer;
