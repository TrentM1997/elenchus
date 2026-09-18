import { serverClient } from "@/lib/services/client/serverClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getWikiExtract = createAsyncThunk(
  "investigate/getWikiExtract",
  async (term: string, thunkAPI) => {
    try {
      const result =
        await serverClient.general.integrations.search.wikipediaExtract(term);
      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown Error";
      return thunkAPI.rejectWithValue(message);
    }
  },
);
