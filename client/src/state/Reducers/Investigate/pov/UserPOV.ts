import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PerspectiveDraft, UserPointOfView } from "./types";

type UserPOVState =
  | { status: "draft"; data: PerspectiveDraft }
  | { status: "established"; data: UserPointOfView };

interface InitialState {
  pov: UserPOVState;
}

const initialState: InitialState = {
  pov: {
    status: "draft",
    data: {
      idea: "",
      perspective: null,
      expertise: null,
      biases: "",
      premises: "",
    },
  },
};

export const UserPOVSlice = createSlice({
  name: "UserPOV",
  initialState: initialState,
  reducers: {
    updatePOV: (state: InitialState, action: PayloadAction<UserPOVState>) => {
      state.pov = action.payload;
    },
    clearPOV: (state: InitialState) => initialState,
  },
});

export const { updatePOV } = UserPOVSlice.actions;

export default UserPOVSlice.reducer;
