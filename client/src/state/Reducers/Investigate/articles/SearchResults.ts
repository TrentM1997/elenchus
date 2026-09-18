import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArticleType } from "@/env";
import { AsyncState } from "@/state/types";
import { QueryNewsApiParams, searchNewsApi } from "./thunks";
import { SearchResultsResponseSchemaType } from "@/lib/schemas/articles/BrowsingOptionSchema";

export type SearchResultsState = AsyncState<SearchResultsResponseSchemaType>;

export type SearchResultsPages = AsyncState<Page>;

export type Page = Array<ArticleType>;

interface SearchResults {
  pages: SearchResultsState;
  currentPage: number;
  activeRequestId: string | null;
  mutePagination: boolean;
}

const initialState: SearchResults = {
  pages: { status: "initial" },
  currentPage: 0,
  activeRequestId: null,
  mutePagination: false,
};

export const SearchResultsSlice = createSlice({
  name: "searchResults",
  initialState: initialState,
  reducers: {
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
      state.pages = { status: "initial" };
      state.currentPage = 0;
    },
  },
  extraReducers(builder) {
    builder.addCase(searchNewsApi.pending, (state: SearchResults) => {
      state.pages = { status: "pending" };
    });
    builder.addCase(searchNewsApi.rejected, (state, action) => {
      state.pages = { status: "failed", details: "Failed to query NewsAPI" };
    });
    builder.addCase(searchNewsApi.fulfilled, (state, action) => {
      const payload = action.payload;
      state.pages = { status: "ready", data: payload };
    });
  },
});

export const {
  resetResults,
  resetArticles,
  getPages,
  incrementPage,
  incrementPageBy,
  decrementPage,
  temporaryPaginationMute,
} = SearchResultsSlice.actions;

export default SearchResultsSlice.reducer;
