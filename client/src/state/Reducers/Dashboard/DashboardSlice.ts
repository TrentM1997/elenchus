import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArticleSchemaType } from "../../../../../schemas/api/types/ArticlesSchema";
import { AsyncState } from "@/state/types";
import { hydrateDashboard } from "./thunks";
import { InvestigationSchemaType } from "../../../../../schemas/api/types/InvestigationSchema";

type SavedArticles = AsyncState<ArticleSchemaType[]>;

type SavedInvestigations = AsyncState<InvestigationSchemaType[]>;

export type OpenedArticle = AsyncState<ArticleSchemaType>;

export type ResearchMetrics = {
  bias: AsyncState<number[]>;
  integrity: AsyncState<number[]>;
  outcomes: AsyncState<StatBreakdownTypes>;
};

interface InitialState {
  articles: SavedArticles;
  investigations: SavedInvestigations;
  ArticleToReview: OpenedArticle;
  metrics: ResearchMetrics;
}

const initialState: InitialState = {
  articles: { status: "initial" },
  investigations: { status: "initial" },
  metrics: {
    bias: { status: "initial" },
    integrity: { status: "initial" },
    outcomes: { status: "initial" },
  },
  ArticleToReview: { status: "initial" },
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    populateArticles: (state, action) => {
      state.articles = action.payload.articles;
    },
    readSavedArticle: (state, action) => {
      state.ArticleToReview = action.payload;
    },
    getIntegrityMetrics: (
      state: InitialState,
      action: PayloadAction<ResearchMetrics["integrity"]>,
    ) => {
      state.metrics.integrity = action.payload;
    },
    getMetrics: (
      state: InitialState,
      action: PayloadAction<ResearchMetrics>,
    ) => {
      state.metrics = action.payload;
    },
    getBiasMetrics: (
      state: InitialState,
      action: PayloadAction<ResearchMetrics["integrity"]>,
    ) => {
      state.metrics.bias = action.payload;
    },
    getOutcomesBreakdown: (
      state: InitialState,
      action: PayloadAction<ResearchMetrics["outcomes"]>,
    ) => {
      state.metrics.outcomes = action.payload;
    },
    clearDashboardSlice: () => initialState,
  },

  extraReducers(builder) {
    builder.addCase(hydrateDashboard.pending, (state: InitialState) => {
      state.articles = { status: "pending" };
      state.investigations = { status: "pending" };
    });

    builder.addCase(hydrateDashboard.rejected, (state, action) => {
      state.investigations = {
        status: "failed",
        details: "Hydration of investigations failed",
      };
      state.articles = {
        status: "failed",
        details: "Hydration of saved articles failed",
      };
    });

    builder.addCase(hydrateDashboard.fulfilled, (state, action) => {
      const { articles, investigations } = action.payload;
      if (articles.ok) {
        if (articles.data.length === 0) {
          state.articles = { status: "empty", message: "No data found" };
        } else {
          state.articles = { status: "ready", data: articles.data };
        }
      }

      if (investigations.length === 0) {
        state.investigations = { status: "empty", message: "No data found" };
      } else {
        state.investigations = { status: "ready", data: investigations };
      }
    });
  },
});

export const {
  readSavedArticle,
  populateArticles,
  getOutcomesBreakdown,
  clearDashboardSlice,
  getBiasMetrics,
  getMetrics,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;

export type DashboardSliceType = ReturnType<typeof DashboardSlice.reducer>;
