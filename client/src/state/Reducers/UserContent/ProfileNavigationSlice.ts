import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";

export type VirtuosoScrollPos =
  | {
      status: "ready";
      position: {
        topKey: string | number | null;
        topIndex: number | null;
        scrollTop: number | null;
        dataVersion: number | null;
        viewportHeight?: number | null;
        savedAt?: number | null;
        listID?: "articles" | "investigations" | null;
      };
    }
  | {
      status: "initial";
    };

interface NavigateProfile {
  displaySavedArticles: boolean;
  displaySavedInvestigations: boolean;
  displayDeleteModal: boolean;
  displayAccountManagement: boolean;
  displayMetrics: boolean;
  displayThisInvestigation: boolean;
  displayThisArticle: boolean;
  backToArticles: boolean;
  backToResearch: boolean;
  articleScrollPosition: VirtuosoScrollPos;
  researchScrollPosition: VirtuosoScrollPos | null;
  readAssociatedArticle: boolean;
}

const initialState: NavigateProfile = {
  displaySavedArticles: false,
  displaySavedInvestigations: false,
  displayDeleteModal: false,
  displayAccountManagement: false,
  displayMetrics: true,
  displayThisInvestigation: false,
  displayThisArticle: false,
  backToArticles: false,
  backToResearch: false,
  articleScrollPosition: { status: "initial" },
  researchScrollPosition: null,
  readAssociatedArticle: false,
};

export const selectArticleScrollPos = (s: RootState) =>
  s.profileNav.articleScrollPosition;

const ProfileNavigationSlice = createSlice({
  name: "profileNav",
  initialState: initialState,
  reducers: {
    storeScrollPosition: (state, action: PayloadAction<VirtuosoScrollPos>) => {
      const next = action.payload;
      const prev = state.articleScrollPosition;

      if (prev.status !== "initial" && next.status !== "initial") {
        if (
          prev &&
          next &&
          prev.position.topKey === next.position.topKey &&
          prev.position.topIndex === next.position.topIndex &&
          prev.position.scrollTop === next.position.scrollTop &&
          prev.position.dataVersion === next.position.dataVersion &&
          prev.position.viewportHeight === next.position.viewportHeight
        )
          return;
      }

      state.articleScrollPosition = next;
    },
    clearScrollPosition: (state) => {
      state.articleScrollPosition = { status: "initial" };
    },
    storeResearchScrollPosition: (
      state,
      action: PayloadAction<VirtuosoScrollPos>,
    ) => {
      const next = action.payload;
      const prev = state.articleScrollPosition;

      if (prev.status !== "initial" && next.status !== "initial") {
        if (
          prev &&
          next &&
          prev.position.topKey === next.position.topKey &&
          prev.position.topIndex === next.position.topIndex &&
          prev.position.scrollTop === next.position.scrollTop &&
          prev.position.dataVersion === next.position.dataVersion &&
          prev.position.viewportHeight === next.position.viewportHeight
        )
          return;
      }

      state.articleScrollPosition = next;
    },
    clearResearchScrollPos: (state) => {
      state.researchScrollPosition = null;
    },
    presentArticles: (state) => {
      state.displaySavedArticles = true;
      state.displayAccountManagement = false;
      state.displayMetrics = false;
      state.displaySavedInvestigations = false;
      state.displayThisInvestigation = false;
      state.displayThisArticle = false;
      state.backToResearch = false;
      state.backToArticles = true;
      state.readAssociatedArticle = false;
    },
    presentResearch: (state) => {
      state.displaySavedInvestigations = true;
      state.displayAccountManagement = false;
      state.displaySavedArticles = false;
      state.displayMetrics = false;
      state.displayThisInvestigation = false;
      state.displayThisArticle = false;
      state.backToResearch = true;
      state.backToArticles = false;
      state.readAssociatedArticle = false;
    },
    presentDeleteModal: (state, action) => {
      state.displayDeleteModal = action.payload;
    },
    presentManagement: (state) => {
      state.displayAccountManagement = true;
      state.displayMetrics = false;
      state.displaySavedArticles = false;
      state.displaySavedInvestigations = false;
      state.displayThisInvestigation = false;
      state.displayThisArticle = false;
      state.backToResearch = false;
      state.backToArticles = false;
      state.readAssociatedArticle = false;
    },
    presentMetrics: (state) => {
      state.displayMetrics = true;
      state.displaySavedInvestigations = false;
      state.displaySavedArticles = false;
      state.displayAccountManagement = false;
      state.displayThisInvestigation = false;
      state.displayThisArticle = false;
      state.backToResearch = false;
      state.backToArticles = false;
      state.readAssociatedArticle = false;
    },
    presentThisInvestigation: (state) => {
      state.displayThisInvestigation = true;
      state.displayAccountManagement = false;
      state.displaySavedInvestigations = false;
      state.displaySavedArticles = false;
      state.displaySavedInvestigations = false;
      state.displayThisArticle = false;
      state.readAssociatedArticle = false;
    },
    presentThisArticle: (state) => {
      state.displayThisArticle = true;
      state.displayThisInvestigation = false;
      state.displayAccountManagement = false;
      state.displaySavedInvestigations = false;
      state.displaySavedArticles = false;
      state.displaySavedInvestigations = false;
      state.readAssociatedArticle = false;
    },
    presentAssociatedArticle: (state) => {
      state.readAssociatedArticle = true;
      state.displayThisInvestigation = false;
      state.displayAccountManagement = false;
      state.displaySavedInvestigations = false;
      state.displaySavedArticles = false;
      state.displaySavedInvestigations = false;
      state.displayThisArticle = false;
      state.displayMetrics = false;
      state.backToArticles = false;
      state.backToResearch = false;
    },
  },
});

export const {
  presentArticles,
  presentResearch,
  presentDeleteModal,
  presentManagement,
  presentMetrics,
  presentThisInvestigation,
  presentThisArticle,
  storeScrollPosition,
  clearScrollPosition,
  storeResearchScrollPosition,
  clearResearchScrollPos,
  presentAssociatedArticle,
} = ProfileNavigationSlice.actions;

export default ProfileNavigationSlice.reducer;
