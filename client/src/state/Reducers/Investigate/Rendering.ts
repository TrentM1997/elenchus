import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalDisplayed =
  | "Back to Search"
  | "Extract Confirmation"
  | "Work Modal"
  | "Feedback Form"
  | null;

export type ActiveToast = "Extraction" | "Login" | "Logout" | "Sign Up" | null;

export type TooltipDisplayed =
  | "Selection Required"
  | "Guide Selection"
  | "Finished Reading Button"
  | "Max Toast"
  | null;

export type SelectionBar = "active" | "hidden";

export type PathSelected = "BlueSky Feed" | "Choose Path" | "Path Chosen";

export type ShowOptions = "Show Options" | "Preselected";

export interface RenderingState {
  modal: ModalDisplayed;
  tooltip: TooltipDisplayed;
  selection: SelectionBar;
  path: PathSelected;
  options: ShowOptions;
}

const initialState: RenderingState = {
  modal: null,
  tooltip: null,
  selection: "hidden",
  path: "Choose Path",
  options: "Show Options",
};

const RenderingSlice = createSlice({
  name: "rendering",
  initialState: initialState,
  reducers: {
    populateModal: (
      state: RenderingState,
      action: PayloadAction<ModalDisplayed>,
    ) => {
      state.modal = action.payload;
    },
    populateTooltip: (
      state: RenderingState,
      action: PayloadAction<TooltipDisplayed>,
    ) => {
      state.tooltip = action.payload;
    },
    animateSelectBar: (
      state: RenderingState,
      action: PayloadAction<SelectionBar>,
    ) => {
      state.selection = action.payload;
    },
    choosePath: (
      state: RenderingState,
      action: PayloadAction<PathSelected>,
    ) => {
      state.path = action.payload;
    },
    pickOption: (state: RenderingState, action: PayloadAction<ShowOptions>) => {
      state.options = action.payload;
    },
  },
});

export type RenderingSliceState = ReturnType<typeof RenderingSlice.reducer>;

export const {
  populateModal,
  populateTooltip,
  animateSelectBar,
  choosePath,
  pickOption,
} = RenderingSlice.actions;

export default RenderingSlice.reducer;
