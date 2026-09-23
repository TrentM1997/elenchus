import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncState } from "@/state/types";
import {
  hydrateDashboard,
  hydrateOpenedArticle,
  hydrateOpenInvestigation,
} from "./thunks";
import { InvestigationSchemaType } from "@/lib/schemas/investigations/InvestigationSchema";
import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";
import { DashboardTab, OpenInvestigation, VirtuosoScrollPos } from "./types";

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
  tab: DashboardTab;
  articleScrollPosition: VirtuosoScrollPos;
  researchScrollPosition: VirtuosoScrollPos;
  openInvestigation: OpenInvestigation;
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
  openInvestigation: { status: "initial" },
  tab: { kind: "metrics" },
  articleScrollPosition: { status: "initial" },
  researchScrollPosition: { status: "initial" },
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    storeScrollPosition: (state, action: PayloadAction<VirtuosoScrollPos>) => {
      state.articleScrollPosition = action.payload;
    },
    storeResearchScrollPosition: (
      state,
      action: PayloadAction<VirtuosoScrollPos>,
    ) => {
      state.researchScrollPosition = action.payload;
    },
    resetDashboardNavigation: (state) => {
      state.tab = { kind: "metrics" };
      state.articleScrollPosition = { status: "initial" };
      state.researchScrollPosition = { status: "initial" };
    },
    changeTab: (state: InitialState, action: PayloadAction<DashboardTab>) => {
      state.tab = action.payload;
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
    openSavedArticle: (
      state: InitialState,
      action: PayloadAction<ArticleSchemaType["id"]>,
    ) => {
      state.tab = {
        kind: "articles",
        display: "review",
        articleId: action.payload,
      };
    },
    clearOpenedArticle: (state: InitialState) => {
      state.ArticleToReview = { status: "initial" };
    },
    clearOpenedInvestigation: (state: InitialState) => {
      state.openInvestigation = { status: "initial" };
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
        if (articles.data.length > 0) {
          state.articles = { status: "ready", data: articles.data };
        } else {
          state.articles = { status: "empty", message: "No data found" };
        }
      }

      if (investigations.ok) {
        if (investigations.data.length > 0) {
          state.investigations = { status: "ready", data: investigations.data };
        } else {
          state.investigations = { status: "empty", message: "No data found" };
        }
      }
    });

    builder.addCase(hydrateOpenInvestigation.pending, (state) => {
      state.openInvestigation = { status: "pending" };
    });

    builder.addCase(hydrateOpenInvestigation.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.openInvestigation = {
        status: "failed",
        details: "Failed to hydrate investigation",
      };
    });

    builder.addCase(hydrateOpenInvestigation.fulfilled, (state, action) => {
      const investigation = action.payload.data;
      state.openInvestigation = { status: "ready", data: investigation };
    });

    builder.addCase(hydrateOpenedArticle.pending, (state) => {
      state.ArticleToReview = { status: "pending" };
    });

    builder.addCase(hydrateOpenedArticle.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.ArticleToReview = {
        status: "failed",
        details: "Failed to hydrate article",
      };
    });
    builder.addCase(hydrateOpenedArticle.fulfilled, (state, action) => {
      const article = action.payload.data;
      state.ArticleToReview = { status: "ready", data: article };
    });
  },
});

export const {
  storeScrollPosition,
  storeResearchScrollPosition,
  resetDashboardNavigation,
  getOutcomesBreakdown,
  clearDashboardSlice,
  getBiasMetrics,
  getMetrics,
  changeTab,
  openSavedArticle,
  clearOpenedArticle,
  clearOpenedInvestigation,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;

export type DashboardSliceType = ReturnType<typeof DashboardSlice.reducer>;
