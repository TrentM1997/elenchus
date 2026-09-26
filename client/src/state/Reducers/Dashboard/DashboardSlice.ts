import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncState } from "@/state/types";
import {
  hydrateDashboard,
  hydrateOpenedArticle,
  hydrateOpenInvestigation,
} from "./thunks";
import {
  InvestigationSchemaType,
  InvestigationsSavedReponseSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { DashboardTab, OpenInvestigation, VirtuosoScrollPos } from "./types";
import { BookmarkedArticlesResponseSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";

export type SavedArticles = AsyncState<ArticleSchemaType[]>;

type SavedInvestigations = AsyncState<InvestigationSchemaType[]>;

export type OpenedArticle = AsyncState<ArticleSchemaType>;

export type ResearchToReviewState = {
  investigation: OpenInvestigation;
  sources: AsyncState<ArticleSchemaType[]>;
};

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
  openInvestigation: ResearchToReviewState;
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
  openInvestigation: {
    investigation: { status: "initial" },
    sources: { status: "initial" },
  },
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
      state.openInvestigation = {
        investigation: { status: "initial" },
        sources: { status: "initial" },
      };
    },
    clearDashboardSlice: () => initialState,
  },

  extraReducers(builder) {
    builder.addCase(hydrateDashboard.pending, (state: InitialState) => {
      state.articles = { status: "pending" };
      state.investigations = { status: "pending" };
    });

    builder.addCase(hydrateDashboard.rejected, (state, action) => {
      if (action.meta.aborted) return;

      state.investigations = {
        status: "failed",
        details: "Hydration of investigations failed",
      };
      state.articles = {
        status: "failed",
        details: "Hydration of saved articles failed",
      };
    });

    builder.addCase(
      hydrateDashboard.fulfilled,
      (
        state: InitialState,
        action: PayloadAction<{
          articles: ArticleSchemaType[];
          investigations: InvestigationSchemaType[];
        }>,
      ) => {
        const { articles, investigations } = action.payload;
        if (articles.length > 0) {
          state.articles = { status: "ready", data: articles };
        } else {
          state.articles = { status: "empty", message: "No data found" };
        }

        if (investigations.length > 0) {
          state.investigations = {
            status: "ready",
            data: investigations,
          };
        } else {
          state.investigations = {
            status: "empty",
            message: "No data found",
          };
        }
      },
    );

    builder.addCase(hydrateOpenInvestigation.pending, (state) => {
      state.openInvestigation = {
        investigation: { status: "pending" },
        sources: { status: "pending" },
      };
    });

    builder.addCase(hydrateOpenInvestigation.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.openInvestigation = {
        investigation: {
          status: "failed",
          details: "Failed to hydrate investigation",
        },
        sources: {
          status: "failed",
          details: "Failed to hydrate sources of investigation",
        },
      };
    });

    builder.addCase(hydrateOpenInvestigation.fulfilled, (state, action) => {
      const prev = state.openInvestigation;

      if (action.payload.investigation.ok && action.payload.sources.ok) {
        const sources = action.payload.sources.data;
        const investigation = action.payload.investigation.data;
        state.openInvestigation = {
          investigation: { status: "ready", data: investigation },
          sources: { status: "ready", data: sources },
        };
      }
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
  clearDashboardSlice,
  getMetrics,
  changeTab,
  openSavedArticle,
  clearOpenedArticle,
  clearOpenedInvestigation,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;

export type DashboardSliceType = ReturnType<typeof DashboardSlice.reducer>;
