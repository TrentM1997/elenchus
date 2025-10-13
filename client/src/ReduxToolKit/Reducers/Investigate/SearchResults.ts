import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ArticleType } from "@/env";
import { ArticleOptionsFetch, fetchArticles } from "@/helpers/FetchRequests";

export const RetrieveArticles = createAsyncThunk<ArticleOptionsFetch, { query: string, timeout?: number }>(
    'investigate/fetchArticles',
    async ({ query, timeout }, thunkAPI) => {

        try {
            const response = await fetchArticles(query, timeout, thunkAPI.signal);

            if (!response) {
                throw new Error(`Unable to query endpoint for article links`);
            }
            if (response) {
                return response;
            } else {
                return
            }
        } catch (error) {
            console.error(error);

            return thunkAPI.rejectWithValue(error);
        };

    }
);

export type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export type Page = Array<ArticleType>;

interface SearchResults {
    articleOptions: Array<ArticleType> | null,
    optionsMap: Map<string, ArticleType> | null,
    status: Status,
    pages: Array<Page> | null,
    currentPage: number | null,
    activeRequestId: string | null
}

const initialState: SearchResults = {
    articleOptions: null,
    optionsMap: null,
    status: 'idle',
    pages: null,
    currentPage: 0,
    activeRequestId: null
};



export const SearchResultsSlice = createSlice({

    name: 'searchResults',
    initialState: initialState,
    reducers: {
        searchResults: (state, action) => {
            state.articleOptions = action.payload.data;
            state.optionsMap = action.payload.optionsLookup;
        },
        getPages: (state, action) => {
            state.pages = action.payload
        },
        incrementPage: (state) => {
            state.currentPage += 1
        },
        decrementPage: (state) => {
            state.currentPage -= 1
        },
        incrementPageBy: (state, action) => {
            state.currentPage = action.payload
        },
        resetResults: () => initialState,
        resetArticles: (state) => {
            state.articleOptions = null;
            state.optionsMap = null;
            state.currentPage = 0;
        }

    },
    extraReducers: (builder) => {

        builder.addCase(RetrieveArticles.pending, (state, action) => {
            state.activeRequestId = action.meta.requestId
            state.status = 'pending';
            state.articleOptions = null;
            state.optionsMap = null;
            state.currentPage = 0;
        }),
            builder.addCase(RetrieveArticles.fulfilled, (state, action) => {
                if (state.activeRequestId !== action.meta.requestId) return;
                state.status = 'fulfilled';
                state.articleOptions = action.payload.data;
                state.activeRequestId = null;
            }),
            builder.addCase(RetrieveArticles.rejected, (state, action) => {
                if (state.activeRequestId !== action.meta.requestId) return;
                state.status = 'rejected';
                state.activeRequestId = null;
            })
    }
})



export const { searchResults, resetResults, resetArticles, getPages, incrementPage, incrementPageBy, decrementPage } = SearchResultsSlice.actions

export default SearchResultsSlice.reducer

