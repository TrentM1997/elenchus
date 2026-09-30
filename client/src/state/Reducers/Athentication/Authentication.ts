import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteAccount, loginUser, logOut, signUp } from "./thunks";

export type UserKind = "anonymous" | "authenticated";

interface Authentication {
  userKind: UserKind;
}

const initialState: Authentication = {
  userKind: "anonymous",
};

export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    authenticated: (state: Authentication, action: PayloadAction<UserKind>) => {
      state.userKind = action.payload;
    },
    clearAuthSlice: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(logOut.fulfilled, (state: Authentication) => {
      state.userKind = "anonymous";
    });

    builder.addCase(loginUser.fulfilled, (state: Authentication) => {
      state.userKind = "authenticated";
    });

    builder.addCase(signUp.fulfilled, (state) => {
      state.userKind === "authenticated";
    });

    builder.addCase(deleteAccount.fulfilled, (state: Authentication) => {
      state.userKind = "anonymous";
    });
  },
});

export const { clearAuthSlice, authenticated } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
