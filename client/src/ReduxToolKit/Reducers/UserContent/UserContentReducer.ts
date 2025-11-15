import { RootState } from "@/ReduxToolKit/store";
import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { Article } from "../Investigate/Reading";
import { User } from "@supabase/supabase-js";

interface UserContent {
    status: string,
    userArticles: Article[] | null,
    articleMap: Map<number, any> | null
    error: any,
    contextForSupabase: string | null,
    ArticleToReview: Article | null,
    deletingArticle: boolean,
    associatedArticle: Article | null
}

const initialState: UserContent = {
    status: 'idle',
    userArticles: [],
    articleMap: null,
    error: null,
    contextForSupabase: null,
    ArticleToReview: null,
    deletingArticle: false,
    associatedArticle: null
}

export const fetchSavedArticles = createAsyncThunk(
    'user/articles',
    async (thunkAPI) => {
        try {
            const response = await fetch('/getUserArticles', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch articles: ${response.statusText}`);
            }
            const results = await response.json();
            return results;

        } catch (error) {
            console.error(error);
        };

    }
);

export const selectUserArticles = (state: RootState) => state.userdata.userArticles ?? [];

export const selectSavedUrlSet = createSelector(
    [selectUserArticles],
    arts => new Set(arts.map(a => a.article_url))
);




const UserContentSlice = createSlice({
    name: 'userContent',
    initialState: initialState,
    reducers: {
        clearUser: () => { return initialState },
        populateArticles: (state, action) => {
            state.userArticles = action.payload.articles;
        },
        supabaseContext: (state, action) => {
            state.contextForSupabase = action.payload
        },
        readSavedArticle: (state, action) => {
            state.ArticleToReview = action.payload
        },
        removeSavedArticle: (state, action) => {
            state.userArticles = state.userArticles.splice(action.payload, 1);
        },
        removingArticle: (state, action) => {
            state.deletingArticle = action.payload;
        },
        refreshArticles: (state, action) => {
            state.userArticles = state.userArticles.filter(a => a.id !== action.payload);
        },
        grabAssociatedArticle: (state, action) => {
            state.associatedArticle = action.payload;
        },
        refreshArticlesStored: (state: UserContent, action: PayloadAction<Article[]>) => {
            state.userArticles = action.payload;
        }


    },
    extraReducers: builder => {

        builder
            .addCase(fetchSavedArticles.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchSavedArticles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (state.userArticles) {
                    state.userArticles = action.payload;
                }
            })
            .addCase(fetchSavedArticles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload
            })
    }
})

export const { clearUser, supabaseContext, readSavedArticle, removeSavedArticle, populateArticles, removingArticle, refreshArticles, grabAssociatedArticle, refreshArticlesStored } = UserContentSlice.actions

export default UserContentSlice.reducer