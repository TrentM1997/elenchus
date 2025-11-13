import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ContentStatus = 'active' | 'idle';

interface Display {
    showMindMap: boolean, //old, doesn't have use anymore
    showSearch: boolean, // replaced by phase state
    showContent: boolean, // replaced by phase state
    showWrapUp: boolean, // replaced by phase state
    showResults: boolean, // replaced by phase state
    showCompletion: boolean, // replaced by phase state
    showWorkModal: boolean, // replaced by modal state
    showSelectBar: boolean, // replaced by selection state
    showBackToSearchModal: boolean, // replaced by modal state
    showGetArticlesModal: boolean, // replaced by modal state
    contentContainer: ContentStatus, // will move into new 'Rendering' reducer
    showSelectWarning: boolean, // replaced by tooltip state
    showSelectTooltip: boolean, // replaced by tooltip state
    showReadingTooltip: boolean, // replaced by tooltip state

    showFeedBackForm: boolean, // will be added to 'Rendering' reducer
    showBlueSkySearch: boolean | null // will be replaced by modal state
}

const initialState: Display = {
    contentContainer: 'idle',
    showMindMap: true,
    showSearch: false,
    showContent: false,
    showWrapUp: false,
    showResults: false,
    showCompletion: false,
    showWorkModal: false,
    showSelectBar: false,
    showBackToSearchModal: false,
    showGetArticlesModal: false,
    showSelectWarning: false,
    showSelectTooltip: false,
    showReadingTooltip: false,
    showFeedBackForm: null,
    showBlueSkySearch: null
}


const DisplaySlice = createSlice({
    name: 'display',
    initialState: initialState,
    reducers: {
        contentStatusChange: (state, action: PayloadAction<ContentStatus>) => {
            state.contentContainer = action.payload;
        },
        displayMindMap: (state, action) => {
            state.showMindMap = action.payload
        },
        displaySearch: (state, action) => {
            state.showSearch = action.payload
        },
        displayArticleContent: (state, action) => {
            state.showContent = action.payload
        },
        displayWrapUp: (state, action) => {
            state.showWrapUp = action.payload
        },
        displayCompletion: (state, action) => {
            state.showCompletion = action.payload
        },
        displayResults: (state, action) => {
            state.showResults = action.payload
        },
        displayWorkModal: (state, action) => {
            state.showWorkModal = action.payload
        },
        displayReturnModal: (state, action) => {
            state.showBackToSearchModal = action.payload
        },
        displayGetArticlesModal: (state, action) => {
            state.showGetArticlesModal = action.payload
        },
        displaySelectionWarning: (state, action) => {
            state.showSelectWarning = action.payload
        },
        displaySelectTooltip: (state, action) => {
            state.showSelectTooltip = action.payload
        },
        displayReadingTooltip: (state, action) => {
            state.showReadingTooltip = action.payload
        },
        displaySelectBar: (state, action) => {
            state.showSelectBar = action.payload
        },
        displayFeedBackForm: (state, action) => {
            state.showFeedBackForm = action.payload
        },
        displayBlueSkySearch: (state, action) => {
            state.showBlueSkySearch = action.payload
        }
    }
})


export type DisplayReducer = ReturnType<typeof DisplaySlice.reducer>;

export const { displayMindMap, displaySearch, displayArticleContent, displayCompletion, displayWrapUp, displayResults,
    displayWorkModal, displayReturnModal, displayGetArticlesModal, displaySelectionWarning, displaySelectTooltip, displayReadingTooltip,
    displaySelectBar, displayFeedBackForm, displayBlueSkySearch, contentStatusChange } = DisplaySlice.actions

export default DisplaySlice.reducer