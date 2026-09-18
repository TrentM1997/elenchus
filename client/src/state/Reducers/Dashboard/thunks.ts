import { serverClient } from "@/lib/services/client/serverClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const hydrateDashboard = createAsyncThunk(
  "DashboardSlice/hydrateDashboard",
  async (_, thunkAPI) => {
    try {
      const [articles, investigations] = await Promise.all([
        serverClient.privileged.user.select.bookmarks(),
        serverClient.privileged.user.select.investigations(),
      ]);

      return {
        articles,
        investigations,
      };
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);
