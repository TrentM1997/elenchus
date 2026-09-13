import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ExtractionService } from "@/lib/services/extractionService";
import type { FailedAttempt, FirecrawlSuccessPayload } from "@/lib/services/types";

export interface Article {
  title: string;
  provider: string;
  authors: string[] | string;
  article_url: string;
  image_url: string;
  date_published: string;
  fallbackDate: string | null;
  summary: any;
  full_text: string;
  logo?: string;
  id: number | null;
  factual_reporting?: string | null;
  bias?: Bias;
  country?: string | null;
}

export type JobStatus = "pending" | "fulfilled" | "rejected";

export type Prog = "extraction complete" | string;

const extractionService = new ExtractionService();

export const runFirecrawlExtraction = createAsyncThunk<
  FirecrawlSuccessPayload,
  { articles: SelectedArticle[] },
  { rejectValue: string }
>("investigate/runFirecrawlExtraction", async ({ articles }, thunkApi) => {
  const { signal, dispatch, rejectWithValue } = thunkApi;

  try {
    return await extractionService.extractArticles({
      articles,
      signal,
      onProgress: (snapshot) => {
        if (signal.aborted) return;

        dispatch(updateStatus(snapshot.status));

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
});

interface ReadingState {
  status: "idle" | "pending" | "fulfilled" | "rejected";
  getContent: boolean;
  articles: Array<Article>;
  failedNotifications: Array<FailedAttempt>;
  currentStory: number;
  reading: boolean;
  paginateLimit: boolean;
  error: string | null;
  progress: Prog;
}

const initialState: ReadingState = {
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

export const ReadingSlice = createSlice({
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
    appendArticles: (state, action: PayloadAction<Article[]>) => {
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
      .addCase(runFirecrawlExtraction.pending, (state) => {
        state.status = "pending";
      })
      .addCase(runFirecrawlExtraction.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.progress = action.payload.progress;
      })
      .addCase(runFirecrawlExtraction.rejected, (state, action) => {
        state.status = "rejected";
        state.error =
          (action.payload as string) || action.error.message || "Unknown error";
      });
  },
});

export type ReadingSliceState = ReturnType<typeof ReadingSlice.reducer>;

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
} = ReadingSlice.actions;

export default ReadingSlice.reducer;
