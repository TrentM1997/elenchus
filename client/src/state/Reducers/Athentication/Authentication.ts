import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logOut } from "./thunks";

interface Authentication {
  userKind: "anonymous" | "authenticated";
  activeSession: boolean;
  signOut: boolean | null;
  signedIn: boolean | null;
  status: string;
}

const initialState: Authentication = {
  userKind: "anonymous",
  activeSession: false,
  signOut: false,
  signedIn: false,
  status: "idle",
};

export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    showSignOut: (state) => {
      state.signOut = !state.signOut;
    },
    redirectFromLogin: (state, action) => {
      state.signedIn = action.payload;
    },
    getCurrentSession: (state, action) => {
      state.activeSession = action.payload;
    },
    authenticate: (state, action: PayloadAction<boolean>) => {
      state.activeSession = action.payload;
    },
    authenticated: (state: Authentication) => {
      state.userKind = "authenticated";
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
  },
});

export const {
  showSignOut,
  redirectFromLogin,
  clearAuthSlice,
  getCurrentSession,
  authenticate,
  authenticated,
} = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
