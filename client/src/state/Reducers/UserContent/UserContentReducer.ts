import { createSlice } from "@reduxjs/toolkit";
import { ArticleSchemaType } from "../../../../../schemas/api/types/ArticlesSchema";
import { AsyncState } from "@/state/types";

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
  supabaseContext,
  readSavedArticle,
  populateArticles,
  removingArticle,
} = UserContentSlice.actions;

export default UserContentSlice.reducer;
