import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Phase = 'Initial' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4' | 'Phase 5' | 'Phase 6';

export type ModalDisplayed = 'Back to Search' | 'Extract Confirmation' | 'Work Modal' | 'Feedback Form' | null;

export type TooltipDisplayed = 'Selection Required' | 'Guide Selection' | 'Finished Reading Button' | 'Max Toast' | null;

export type SelectionBar = 'active' | 'hidden'

export type PathSelected = 'BlueSky Feed' | 'Manual Input' | 'Path Chosen' | null;

export type ShowOptions = 'Show Options' | 'Preselected';

export interface RenderingState {
    phase: Phase,
    modal: ModalDisplayed,
    tooltip: TooltipDisplayed,
    selection: SelectionBar,
    path: PathSelected,
    options: ShowOptions
}


const initialState: RenderingState = {
    phase: 'Initial',
    modal: null,
    tooltip: null,
    selection: 'hidden',
    path: null,
    options: 'Show Options'
}


const RenderingSlice = createSlice({
    name: 'rendering',
    initialState: initialState,
    reducers: {
        changePhase: (state: RenderingState, action: PayloadAction<Phase>) => {
            state.phase = action.payload;
        },
        populateModal: (state: RenderingState, action: PayloadAction<ModalDisplayed>) => {
            state.modal = action.payload;
        },
        populateTooltip: (state: RenderingState, action: PayloadAction<TooltipDisplayed>) => {
            state.tooltip = action.payload;
        },
        animateSelectBar: (state: RenderingState, action: PayloadAction<SelectionBar>) => {
            state.selection = action.payload;
        },
        choosePath: (state: RenderingState, action: PayloadAction<PathSelected>) => {
            state.path = action.payload;
        },
        pickOption: (state: RenderingState, action: PayloadAction<ShowOptions>) => {
            state.options = action.payload;
        }
    }
});


export type RenderingSliceState = ReturnType<typeof RenderingSlice.reducer>


export const {
    changePhase,
    populateModal,
    populateTooltip,
    animateSelectBar,
    choosePath,
    pickOption
} = RenderingSlice.actions;


export default RenderingSlice.reducer