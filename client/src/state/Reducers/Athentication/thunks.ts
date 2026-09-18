import { LoginCredentials } from "@/lib/services/auth/clientAuthService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverClient } from "@/lib/services/client/serverClient";

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (params: LoginCredentials, thunkAPI) => {
    try {
      const result = await serverClient.general.auth.login(params);
      if (result.error) {
        throw new Error("Login failed");
      }
      return result;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const logOut = createAsyncThunk("/auth/logOut", async (_, thunkAPI) => {
  try {
    const result = await serverClient.general.auth.logOut();

    if (!result.ok) {
      throw new Error("Login request failed");
    }
    return result;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});
