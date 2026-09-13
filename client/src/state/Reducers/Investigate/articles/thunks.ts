import { createAsyncThunk } from "@reduxjs/toolkit";
import { getArticles } from "@/lib/services/news/getArticles";

export type QueryNewsApiParams = {
  query: string;
  timeout: number;
};

export const queryNewsApi = createAsyncThunk(
  "/investigation/queryNewsApi",
  async (params: QueryNewsApiParams, thunkAPI) => {
    try {
      const response = await getArticles(
        params.query,
        params.timeout,
        thunkAPI.signal,
      );

      if (!response) {
        throw new Error(`Unable to query endpoint for article links`);
      }
      if (response) {
        return response;
      } else {
        return;
      }
    } catch (error) {
      console.error(error);

      return thunkAPI.rejectWithValue(error);
    }
  },
);
