import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ActiveModal = 'Back to Search' | 'Extract Confirmation' | 'Work Modal' | 'Feedback Form' | 'Sign Out' | 'Bluesky Post Selected' | 'Delete Account' | null;

export type ActiveToast = 'Pending Extractions Status' | 'Sign In Status' | 'Sign Out Status' | 'Deleting Article Status' | 'Maximum Articles Selected' | 'Article Saving Status' | null;

export interface PipelineState {
    modal: ActiveModal,
    toast: ActiveToast
};


const initialState: PipelineState = {
    modal: null,
    toast: null
};



const PipelineSlice = createSlice({
    name: 'OverlayPipeline',
    initialState: initialState,
    reducers: {
        renderModal: (state: PipelineState, action: PayloadAction<ActiveModal>) => {
            state.modal = action.payload;
        },
        renderToast: (state: PipelineState, action: PayloadAction<ActiveToast>) => {
            state.toast = action.payload;
        }
    }
});

export type PipelineReducerType = ReturnType<typeof PipelineSlice.reducer>;

export const { renderModal, renderToast } = PipelineSlice.actions;

export default PipelineSlice.reducer;
