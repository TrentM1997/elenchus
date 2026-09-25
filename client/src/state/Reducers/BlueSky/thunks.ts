import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverClient } from "@/lib/services/client/serverClient";

export const hydrateFeed = createAsyncThunk(
  "BlueSkySlice/hydrateFeed",
  async (_, thunkAPI) => {
    try {
      return await serverClient.general.integrations.blueSkyFeed();
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const searchBlueSky = createAsyncThunk(
  "investigate/getBlueSkyPosts",
  async (query: string, thunkAPI) => {
    try {
      const result =
        await serverClient.general.integrations.search.blueSky(query);

      if (!result) {
        throw new Error("Failed to fetch posts on BlueSky");
      }

      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
