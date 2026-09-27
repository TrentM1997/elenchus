import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncState } from "@/state/types";
import {
  hydrateBookmarkRecords,
  hydrateDashboard,
  hydrateOpenedArticle,
  hydrateOpenInvestigation,
} from "./thunks";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  DashboardBookmarkState,
  DashboardTab,
  OpenInvestigation,
  OpenInvestigationExtracts,
  VirtuosoScrollPos,
} from "./types";

export type SavedArticles = AsyncState<ArticleSchemaType[]>;

type SavedInvestigations = AsyncState<InvestigationSchemaType[]>;

export type OpenedArticle = AsyncState<ArticleSchemaType>;

export type ResearchToReviewState = {
  investigation: OpenInvestigation;
  sources: AsyncState<ArticleSchemaType[]>;
  extracts: OpenInvestigationExtracts;
};

export type ResearchMetrics = {
  bias: AsyncState<number[]>;
  integrity: AsyncState<number[]>;
  outcomes: AsyncState<StatBreakdownTypes>;
};

interface InitialState {
  bookmarkRequestId: string | null;
  bookmarks: DashboardBookmarkState;
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
  bookmarkRequestId: null,
  bookmarks: { status: "initial" },
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
    extracts: { status: "initial" },
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
        extracts: { status: "initial" },
      };
    },
    clearDashboardSlice: () => initialState,
  },

  extraReducers(builder) {
    builder.addCase(hydrateBookmarkRecords.pending, (state, action) => {
      state.bookmarkRequestId = action.meta.requestId;
      state.bookmarks = { status: "pending" };
    });

    builder.addCase(hydrateBookmarkRecords.rejected, (state, action) => {
      if (state.bookmarkRequestId !== action.meta.requestId) return;
      state.bookmarkRequestId = null;
      if (action.meta.aborted) {
        state.bookmarks = { status: "initial" };
      } else {
        state.bookmarks = {
          status: "failed",
          details: "Failed to retrieve bookmark records",
        };
      }
    });

    builder.addCase(hydrateBookmarkRecords.fulfilled, (state, action) => {
      if (state.bookmarkRequestId !== action.meta.requestId) return;
      state.bookmarkRequestId = null;
      const result = action.payload;
      if (result.length === 0) {
        state.bookmarks = {
          status: "empty",
          message: "No bookmark records found",
        };
      } else {
        state.bookmarks = { status: "ready", data: result };
      }
    });

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
        extracts: { status: "pending" },
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
        extracts: {
          status: "failed",
          details: "Failed to hydrate extracted terms from wikipedia",
        },
      };
    });

    builder.addCase(hydrateOpenInvestigation.fulfilled, (state, action) => {
      const { investigation, sources, extracts } = action.payload;

      if (investigation.ok === false) {
        state.openInvestigation.investigation = {
          status: "failed",
          details: investigation.message,
        };
      } else {
        state.openInvestigation.investigation = {
          status: "ready",
          data: investigation.data,
        };
      }

      if (extracts.ok === false) {
        state.openInvestigation.extracts = {
          status: "failed",
          details: extracts.message,
        };
      } else {
        state.openInvestigation.extracts = {
          status: "ready",
          data: extracts.data,
        };
      }

      if (sources.ok === false) {
        state.openInvestigation.sources = {
          status: "failed",
          details: sources.message,
        };
      } else {
        state.openInvestigation.sources = {
          status: "ready",
          data: sources.data,
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
