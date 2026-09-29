import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { serverClient } from "@/lib/services/client/serverClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const hydrateBookmarkRecords = createAsyncThunk(
  "DashboardSlice/hydrateBookmarkRecords",
  async (_, thunkAPI) => {
    const { signal } = thunkAPI;

    try {
      const results =
        await serverClient.privileged.user.select.bookmarks.records(signal);
      if (!results.ok) {
        throw new Error("Failed to retrieve bookmark records");
      }

      return results.data;
    } catch (err) {
      if (signal.aborted) {
        return thunkAPI.rejectWithValue(
          "Bookmark records retrieval cancelled by user/navigation",
        );
      } else {
        return thunkAPI.rejectWithValue(
          err instanceof Error
            ? err.message
            : "Bookmark records retrieval failed",
        );
      }
    }
  },
);

export const hydrateDashboard = createAsyncThunk(
  "DashboardSlice/hydrateDashboard",
  async (_, thunkAPI) => {
    try {
      const [articles, investigations] = await Promise.all([
        serverClient.privileged.user.select.bookmarks.all(thunkAPI.signal),
        serverClient.privileged.user.select.investigations.all(thunkAPI.signal),
      ]);

      if (!articles.ok) {
        throw new Error("Failed to hydrate articles");
      }

      if (!investigations.ok) {
        throw new Error("Failed to hydrate investigations");
      }

      return {
        articles: articles.data,
        investigations: investigations.data,
      };
    } catch (err) {
      if (thunkAPI.signal.aborted) {
        console.log("Dashboard hydration aborted");
      } else {
        console.error(err);
      }

      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to load dashboard",
      );
    }
  },
);

export const hydrateOpenInvestigation = createAsyncThunk(
  "DashboardSlice/hydrateOpenInvestigation",
  async (investigation_id: InvestigationSchemaType["id"], thunkAPI) => {
    try {
      const result =
        await serverClient.privileged.user.select.investigations.byId(
          investigation_id,
          thunkAPI.signal,
        );

      if (result.ok === false) {
        throw new Error(
          `Message: ${result.message} — Detials: ${result.details}`,
        );
      }

      return {
        investigation: result.data.investigation,
        sources: result.data.sources,
        extracts: result.data.extracts,
      };
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to load investigation",
      );
    }
  },
);

export const hydrateOpenedArticle = createAsyncThunk(
  "DashboardSlice/hydrateOpenArticle",
  async (article_id: ArticleSchemaType["id"], thunkAPI) => {
    try {
      const result = await serverClient.privileged.user.select.bookmarks.byId(
        article_id,
        thunkAPI.signal,
      );

      if (result.ok === false) {
        throw new Error(
          `Message: ${result.message} — Detials: ${result.details}`,
        );
      }
      return result;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to load article",
      );
    }
  },
);
