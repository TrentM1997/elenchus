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
  OpenedResearchState,
  VirtuosoScrollPos,
} from "./types";

export type SavedArticles = AsyncState<ArticleSchemaType[]>;

type SavedInvestigations = AsyncState<InvestigationSchemaType[]>;

export type OpenedArticle = AsyncState<ArticleSchemaType>;

export type ResearchMetricsState = AsyncState<{
  bias: number[];
  integrity: IntegrityRatings;
  outcomes: StatBreakdownTypes;
}>;

interface InitialState {
  bookmarkRequestId: string | null;
  bookmarks: DashboardBookmarkState;
  articles: SavedArticles;
  investigations: SavedInvestigations;
  ArticleToReview: OpenedArticle;
  metrics: ResearchMetricsState;
  tab: DashboardTab;
  articleScrollPosition: VirtuosoScrollPos;
  researchScrollPosition: VirtuosoScrollPos;
  openInvestigation: OpenedResearchState;
}

const initialState: InitialState = {
  bookmarkRequestId: null,
  bookmarks: { status: "initial" },
  articles: { status: "initial" },
  investigations: { status: "initial" },
  metrics: { status: "initial" },
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
    changeTab: (state: InitialState, action: PayloadAction<DashboardTab>) => {
      state.tab = action.payload;
    },

    getMetrics: (
      state: InitialState,
      action: PayloadAction<ResearchMetricsState>,
    ) => {
      state.metrics = action.payload;
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

        if (investigations.length === 0 && articles.length === 0) {
        }

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
      state.openInvestigation = { status: "pending" };
    });

    builder.addCase(hydrateOpenInvestigation.rejected, (state, action) => {
      if (action.meta.aborted) return;

      state.openInvestigation = {
        status: "failed",
        details:
          typeof action.payload === "string"
            ? action.payload
            : (action.error.message ??
              "Failed to hydrate opened investigation"),
      };
    });

    builder.addCase(hydrateOpenInvestigation.fulfilled, (state, action) => {
      state.openInvestigation = { status: "ready", data: action.payload };
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
  clearDashboardSlice,
  getMetrics,
  changeTab,
  clearOpenedArticle,
  clearOpenedInvestigation,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;

export type DashboardSliceType = ReturnType<typeof DashboardSlice.reducer>;
