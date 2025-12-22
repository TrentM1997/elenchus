import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";

export interface VirtuosoScrollPos {
    topKey: string | number | null,
    topIndex: number | null,
    scrollTop: number | null,
    dataVersion: number | null,
    viewportHeight?: number | null,
    savedAt?: number | null,
    listID?: 'articles' | 'investigations' | null;
};


interface NavigateProfile {

    displaySavedArticles: boolean,
    displaySavedInvestigations: boolean,
    displayDeleteModal: boolean,
    displayAccountManagement: boolean,
    displayMetrics: boolean,
    displayThisInvestigation: boolean,
    displayThisArticle: boolean,
    backToArticles: boolean,
    backToResearch: boolean,
    articleScrollPosition: VirtuosoScrollPos | null,
    researchScrollPosition: VirtuosoScrollPos | null,
    readAssociatedArticle: boolean
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
    articleScrollPosition: null,
    researchScrollPosition: null,
    readAssociatedArticle: false
}


export const selectArticleScrollPos = (s: RootState) => s.profileNav.articleScrollPosition;


const ProfileNavigationSlice = createSlice({
    name: 'profileNav',
    initialState: initialState,
    reducers: {
        storeScrollPosition: (state, action: PayloadAction<VirtuosoScrollPos | null>) => {
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
        clearScrollPosition: (state) => {
            state.articleScrollPosition = null
        },
        storeResearchScrollPosition: (state, action: PayloadAction<VirtuosoScrollPos | null>) => {
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
        }
    }
});


export const { presentArticles, presentResearch, presentDeleteModal, presentManagement, presentMetrics, presentThisInvestigation, presentThisArticle, storeScrollPosition, clearScrollPosition, storeResearchScrollPosition, clearResearchScrollPos, presentAssociatedArticle } = ProfileNavigationSlice.actions;

export default ProfileNavigationSlice.reducer;