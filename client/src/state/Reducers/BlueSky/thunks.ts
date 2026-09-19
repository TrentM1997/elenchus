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
    const options: OptionsTypes = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        `/searchBlueSky?q=${encodeURIComponent(query)}`,
        options,
      );
      if (response.ok) {
        const results = response.json();
        return results;
      } else {
        return thunkAPI.rejectWithValue("Connection refused");
      }
    } catch (error) {
      if (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  },
);
