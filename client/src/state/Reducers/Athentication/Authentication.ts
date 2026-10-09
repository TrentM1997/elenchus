import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteAccount, loginUser, logOut, signUp } from "./thunks";

export type UserKind = "anonymous" | "authenticated";

export type AuthState =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "failed" }
  | { status: "success" };

interface Authentication {
  userKind: UserKind;
  loginState: AuthState;
}

const initialState: Authentication = {
  userKind: "anonymous",
  loginState: { status: "initial" },
};

export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    authenticated: (state: Authentication, action: PayloadAction<UserKind>) => {
      state.userKind = action.payload;
    },
    resetLoginState: (state: Authentication) => {
      state.loginState = { status: "initial" };
    },
  },
  extraReducers(builder) {
    builder.addCase(logOut.fulfilled, (state: Authentication) => {
      state.userKind = "anonymous";
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loginState = { status: "pending" };
    });

    builder.addCase(loginUser.fulfilled, (state: Authentication) => {
      state.userKind = "authenticated";
      state.loginState = { status: "success" };
    });

    builder.addCase(loginUser.rejected, (state) => {
      state.loginState = { status: "failed" };
      state.userKind = "anonymous";
    });

    builder.addCase(signUp.fulfilled, (state) => {
      state.userKind = "authenticated";
    });

    builder.addCase(deleteAccount.fulfilled, (state: Authentication) => {
      state.userKind = "anonymous";
    });
  },
});

export const { authenticated, resetLoginState } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
