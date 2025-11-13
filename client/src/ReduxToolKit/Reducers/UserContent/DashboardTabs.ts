import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ActiveTab = 'Metrics' | 'Investigations' | 'Articles' | 'Review Article' | 'Review Investigation' | 'Associated Article' | 'Manage Account';

export type DashboardModal = 'Sign Out' | null;

export interface VirtuosoScrollPos {
    topKey: string | number | null,
    topIndex: number | null,
    scrollTop: number | null,
    dataVersion: number | null,
    viewportHeight?: number | null,
    savedAt?: number | null,
    listID?: 'articles' | 'investigations' | null;
};

export interface DashboardTabs {
    tab: ActiveTab,
    articleScrollPosition: VirtuosoScrollPos | null,
    researchScrollPosition: VirtuosoScrollPos | null,
    modal: DashboardModal
};

const initialState: DashboardTabs = {
    tab: 'Metrics',
    articleScrollPosition: null,
    researchScrollPosition: null,
    modal: null
}


const DashboardTabsSlice = createSlice({
    name: 'DashboardTabs',
    initialState: initialState,
    reducers: {
        chooseTab: (state: DashboardTabs, action: PayloadAction<ActiveTab>) => {
            state.tab = action.payload;
        },
        storeArticleScrollPos: (state: DashboardTabs, action: PayloadAction<VirtuosoScrollPos>) => {
            const next = action.payload;
            const prev = state.articleScrollPosition;

            if (
                prev &&
                next &&
                prev.topKey === next.topKey &&
                prev.topIndex === next.topIndex &&
                prev.scrollTop === next.scrollTop &&
                prev.dataVersion === next.dataVersion &&
                prev.viewportHeight === next.viewportHeight
            ) return;

            state.articleScrollPosition = next;

        },
        storeResearchScrollPos: (state: DashboardTabs, action: PayloadAction<VirtuosoScrollPos>) => {
            const next = action.payload;
            const prev = state.researchScrollPosition;

            if (
                prev &&
                next &&
                prev.topKey === next.topKey &&
                prev.topIndex === next.topIndex &&
                prev.scrollTop === next.scrollTop &&
                prev.dataVersion === next.dataVersion &&
                prev.viewportHeight === next.viewportHeight
            ) return;

            state.researchScrollPosition = next;
        },
        resetDashboard: (state: DashboardTabs) => {
            state.tab = 'Metrics';
            state.articleScrollPosition = null;
            state.researchScrollPosition = null;
            state.modal = null;
        }
    }
});

export type DashboardTabsReducer = ReturnType<typeof DashboardTabsSlice.reducer>;

export const { chooseTab, storeArticleScrollPos, storeResearchScrollPos, resetDashboard } = DashboardTabsSlice.actions;

export default DashboardTabsSlice.reducer;