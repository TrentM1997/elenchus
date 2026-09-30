import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverClient } from "@/lib/services/client/serverClient";
import { LoginCredentials } from "@/lib/services/client/public/handlers/AuthHandler";

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (params: LoginCredentials, thunkAPI) => {
    try {
      const result = await serverClient.general.auth.login(params);
      if (result.ok === false) {
        throw new Error("Login failed");
      }
      return result;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const logOut = createAsyncThunk(
  "/auth/logOut",
  async (_: void, thunkAPI) => {
    try {
      const result = await serverClient.general.auth.logOut();

      if (!result.ok) {
        throw new Error("Login request failed");
      }
      return result;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to log out user",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      return await serverClient.general.auth.resetPassword(credentials);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const result = await serverClient.general.auth.signup(
        credentials,
        thunkAPI.signal,
      );

      if (!result.ok) {
        throw new Error("Failed to create new user");
      }

      return result;
    } catch (err) {
      if (thunkAPI.signal.aborted) {
        console.log("signup aborted by user/navigation");
      }
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete account",
      );
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const result = await serverClient.privileged.account.deleteAccount(
        credentials,
        thunkAPI.signal,
      );

      if (result.ok === false) {
        throw new Error("Account deletion failed");
      }

      return result;
    } catch (err) {
      if (thunkAPI.signal.aborted) {
        console.log("account deletion aborted by user/navigation");
      }
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete account",
      );
    }
  },
);
