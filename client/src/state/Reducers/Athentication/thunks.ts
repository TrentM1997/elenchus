import { LoginParams } from "@/lib/services/auth/clientAuthService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ClientAuthService } from "@/lib/services/auth/clientAuthService";
const service = new ClientAuthService();

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (params: LoginParams, thunkAPI) => {
    try {
      const result = await service.login(params);
      if (!result.ok) {
        throw new Error("Login request failed");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const logOut = createAsyncThunk("/auth/logOut", async (_, thunkAPI) => {
  try {
    const result = await service.logOut({
      endpoint: "/auth/logOut",
      credentials: "include",
    });

    if (!result.ok) {
      throw new Error("Login request failed");
    }
    return result;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});
