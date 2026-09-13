import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArticleType } from "@/env";
import { AsyncState } from "@/state/types";
import { ArticleOptionsFetch } from "@/infra/api/searchNews";
import { QueryNewsApiParams } from "./thunks";
import { getArticles } from "@/lib/services/news/getArticles";

export type SearchResultsState = AsyncState<ArticleType>;

export type SearchResultsPages = AsyncState<Page>;

export type Status = "idle" | "pending" | "fulfilled" | "rejected";

export type Page = Array<ArticleType>;

interface SearchResults {
  articleOptions: SearchResultsState;
  optionsMap: Map<string, ArticleType> | null;
  status: Status;
  pages: SearchResultsPages;
  currentPage: number;
  activeRequestId: string | null;
  mutePagination: boolean;
}

const initialState: SearchResults = {
  articleOptions: { status: "initial" },
  optionsMap: null,
  status: "idle",
  pages: { status: "initial" },
  currentPage: 0,
  activeRequestId: null,
  mutePagination: false,
};

export const RetrieveArticles = createAsyncThunk(
  "investigate/fetchArticles",
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

export const SearchResultsSlice = createSlice({
  name: "searchResults",
  initialState: initialState,
  reducers: {
    searchResults: (state, action) => {
      state.articleOptions = action.payload.data;
      state.optionsMap = action.payload.optionsLookup;
    },
    getPages: (state, action) => {
      state.pages = action.payload;
    },
    incrementPage: (state: SearchResults) => {
      state.currentPage += 1;
    },
    decrementPage: (state) => {
      state.currentPage -= 1;
    },
    incrementPageBy: (state, action) => {
      state.currentPage = action.payload;
    },
    temporaryPaginationMute: (
      state: SearchResults,
      action: PayloadAction<boolean>,
    ) => {
      state.mutePagination = action.payload;
    },
    resetResults: () => initialState,
    resetArticles: (state) => {
      state.articleOptions = { status: "initial" };
      state.optionsMap = null;
      state.currentPage = 0;
    },
  },
  extraReducers: (builder) => {
    (builder.addCase(RetrieveArticles.pending, (state, action) => {
      state.activeRequestId = action.meta.requestId;
      state.status = "pending";
      state.articleOptions = { status: "pending" };
      state.optionsMap = null;
      state.currentPage = 0;
    }),
      builder.addCase(RetrieveArticles.fulfilled, (state, action) => {
        const payload = action.payload?.data;
        if (state.activeRequestId !== action.meta.requestId) return;

        state.status = "fulfilled";
        state.articleOptions = {
          status: "ready",
          data: action.payload?.data ?? [],
        };
        state.activeRequestId = null;
      }),
      builder.addCase(RetrieveArticles.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        state.status = "rejected";
        state.activeRequestId = null;
      }));
  },
});

export const {
  searchResults,
  resetResults,
  resetArticles,
  getPages,
  incrementPage,
  incrementPageBy,
  decrementPage,
  temporaryPaginationMute,
} = SearchResultsSlice.actions;

export default SearchResultsSlice.reducer;
