import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncState } from "@/state/types";
import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";

type SavedArticles = AsyncState<ArticleSchemaType[]>;

export type OpenedArticle = AsyncState<ArticleSchemaType>;

interface InitialState {
  articles: SavedArticles;
  contextForSupabase: string | null;
  ArticleToReview: OpenedArticle;
  deletingArticle: boolean;
  associatedArticle: ArticleSchemaType | null;
}

const initialState: InitialState = {
  articles: { status: "initial" },
  contextForSupabase: null,
  ArticleToReview: { status: "initial" },
  deletingArticle: false,
  associatedArticle: null,
};

const UserContentSlice = createSlice({
  name: "userContent",
  initialState: initialState,
  reducers: {
    grabAssociatedArticle: (state, action: PayloadAction<ArticleSchemaType | null>) => {
      state.associatedArticle = action.payload;
    },
    clearUser: () => {
      return initialState;
    },
    populateArticles: (state, action) => {
      state.articles = action.payload.articles;
    },
    supabaseContext: (state, action) => {
      state.contextForSupabase = action.payload;
    },
    readSavedArticle: (state, action) => {
      state.ArticleToReview = action.payload;
    },

    removingArticle: (state, action) => {
      state.deletingArticle = action.payload;
    },
  },
});

export const {
  clearUser,
  grabAssociatedArticle,
  supabaseContext,
  readSavedArticle,
  populateArticles,
  removingArticle,
} = UserContentSlice.actions;

export default UserContentSlice.reducer;
