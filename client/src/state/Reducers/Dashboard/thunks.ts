import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { serverClient } from "@/lib/services/client/serverClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const hydrateDashboard = createAsyncThunk(
  "DashboardSlice/hydrateDashboard",
  async (_, thunkAPI) => {
    try {
      const [articles, investigations] = await Promise.all([
        serverClient.privileged.user.select.bookmarks.all(),
        serverClient.privileged.user.select.investigations.all(),
      ]);

      return {
        articles,
        investigations,
      };
    } catch (err) {
      console.error(err);
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
        err instanceof Error ? err.message : "Failed to load investigation",
      );
    }
  },
);

export const hydrateOpenedArticle = createAsyncThunk(
  "DashboardSlice/hydrateOpenArticle",
  async (article_id: ArticleSchemaType["id"], thunkAPI) => {
    try {
      const result =
        await serverClient.privileged.user.select.bookmarks.byId(article_id);

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
