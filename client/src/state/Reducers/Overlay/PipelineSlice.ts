import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GuideTip =
  | "Selection Required"
  | "Guide Selection"
  | "Finished Reading Button"
  | "Max Toast"
  | null;

export type ActiveModal =
  | "Back to Search"
  | "Extract Confirmation"
  | "Feedback Form"
  | "Sign Out"
  | "Bluesky Post Selected"
  | "Delete Account"
  | "Article Extraction Warning"
  | null;

export type ToastKind =
  | "login"
  | "logout"
  | "signup"
  | "save investigation"
  | "delete account"
  | "feedback";

export type ActiveToast =
  | { status: "idle"; kind: null }
  | { status: "pending"; kind: ToastKind }
  | { status: "success"; kind: ToastKind }
  | { status: "failed"; kind: ToastKind };

export interface PipelineState {
  modal: ActiveModal;
  toast: ActiveToast;
  guideTip: GuideTip;
}

const initialState: PipelineState = {
  modal: null,
  guideTip: null,
  toast: { status: "idle", kind: null },
};

const PipelineSlice = createSlice({
  name: "OverlayPipeline",
  initialState: initialState,
  reducers: {
    renderModal: (state: PipelineState, action: PayloadAction<ActiveModal>) => {
      state.modal = action.payload;
    },
    renderToast: (state: PipelineState, action: PayloadAction<ActiveToast>) => {
      state.toast = action.payload;
    },
    renderGuideTip: (state: PipelineState, action: PayloadAction<GuideTip>) => {
      state.guideTip = action.payload;
    },
  },
});

export type PipelineReducerType = ReturnType<typeof PipelineSlice.reducer>;

export const { renderModal, renderToast, renderGuideTip } =
  PipelineSlice.actions;

export default PipelineSlice.reducer;
