import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VirtuosoScrollPos } from "./ProfileNavigationSlice";

export type ActiveTab =
  | "Metrics"
  | "Investigations"
  | "Articles"
  | "Review Article"
  | "Review Investigation"
  | "Associated Article"
  | "Manage Account";

export type DashboardModal = "Sign Out" | null;

export interface DashboardTabs {
  tab: ActiveTab;
  articleScrollPosition: VirtuosoScrollPos;
  researchScrollPosition: VirtuosoScrollPos;
  modal: DashboardModal;
}

const initialState: DashboardTabs = {
  tab: "Metrics",
  articleScrollPosition: { status: "initial" },
  researchScrollPosition: { status: "initial" },
  modal: null,
};

const DashboardTabsSlice = createSlice({
  name: "DashboardTabs",
  initialState: initialState,
  reducers: {
    chooseTab: (state: DashboardTabs, action: PayloadAction<ActiveTab>) => {
      state.tab = action.payload;
    },
    storeArticleScrollPos: (
      state: DashboardTabs,
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
    storeResearchScrollPos: (
      state: DashboardTabs,
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
    resetDashboard: (state: DashboardTabs) => {
      state.tab = "Metrics";
      state.articleScrollPosition = { status: "initial" };
      state.researchScrollPosition = { status: "initial" };
      state.modal = null;
    },
  },
});

export type DashboardTabsReducer = ReturnType<
  typeof DashboardTabsSlice.reducer
>;

export const {
  chooseTab,
  storeArticleScrollPos,
  storeResearchScrollPos,
  resetDashboard,
} = DashboardTabsSlice.actions;

export default DashboardTabsSlice.reducer;
