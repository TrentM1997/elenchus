import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FailedAttempt } from "@/lib/services/types";
import { extractArticles } from "./thunks";
import type { ArticleSchemaType } from "../../../../../../schemas/api/types/ArticlesSchema";
import { Prog } from "./types";

interface InitialState {
  status: "idle" | "pending" | "fulfilled" | "rejected";
  getContent: boolean;
  articles: Array<ArticleSchemaType>;
  failedNotifications: Array<FailedAttempt>;
  currentStory: number;
  reading: boolean;
  paginateLimit: boolean;
  error: string | null;
  progress: Prog;
}

const initialState: InitialState = {
  status: "idle",
  getContent: false,
  articles: [],
  failedNotifications: [],
  currentStory: 0,
  reading: false,
  paginateLimit: false,
  error: null,
  progress: "0",
};

export const ExtractedArticleSlice = createSlice({
  name: "readingReducer",
  initialState: initialState,
  reducers: {
    getStories: (state, action) => {
      state.getContent = action.payload;
    },
    updateProgress: (state, action) => {
      const prev = state.progress;
      const next = action.payload;
      if (next !== prev) {
        state.progress = next;
      }
    },
    appendArticles: (state, action: PayloadAction<ArticleSchemaType[]>) => {
      const nextBatch = action.payload;
      for (const batchItem of nextBatch) {
        const url = batchItem.article_url;
        const already = state.articles.find(
          (a) => a.article_url === batchItem.article_url,
        );
        if (!already) {
          state.articles.push(batchItem);
        }

        const index = state.failedNotifications.findIndex(
          (f) => f.article_url === url,
        );
        if (index !== -1) {
          state.failedNotifications.splice(index, 1);
        }
      }
    },
    appendFailures: (state, action: PayloadAction<FailedAttempt[]>) => {
      const nextBatch = action.payload;
      for (const f of nextBatch) {
        const url = f.article_url;
        if (state.articles.some((a) => a.article_url === url)) continue;
        if (!state.failedNotifications.some((x) => x.article_url === url)) {
          state.failedNotifications.push(f);
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

    updateStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(extractArticles.pending, (state) => {
        state.status = "pending";
      })
      .addCase(extractArticles.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.progress = action.payload.progress;
      })
      .addCase(extractArticles.rejected, (state, action) => {
        state.status = "rejected";
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
  updateStatus,
  updateProgress,
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
