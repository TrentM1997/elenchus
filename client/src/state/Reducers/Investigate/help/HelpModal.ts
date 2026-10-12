import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InvestigationFramingHelpStatus = "idle" | "active";

interface HelpModal {
  status: InvestigationFramingHelpStatus;
}

const initialState: HelpModal = {
  status: "idle",
};

export const HelpSlice = createSlice({
  name: "HelpModal",
  initialState: initialState,
  reducers: {
    toggleHelp: (
      state: HelpModal,
      action: PayloadAction<InvestigationFramingHelpStatus>,
    ) => {
      state.status = action.payload;
    },
  },
});

export const { toggleHelp } = HelpSlice.actions;

export default HelpSlice.reducer;
