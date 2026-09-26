import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverClient } from "@/lib/services/client/serverClient";
import { UserResearchType } from "./types";
import { PersistInvestigationInputSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { updateResearchPersistence } from "./ResearchSlice";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export const saveInvgestigation = createAsyncThunk(
  "ResearchSlice/saveInvgestigation",
  async (
    args: {
      research: Extract<UserResearchType, { phase: "completed" }>["data"];
      articleIds: ArticleSchemaType["id"][];
    },
    thunkAPI,
  ) => {
    thunkAPI.dispatch(updateResearchPersistence({ status: "pending" }));
    const { articleIds } = args;
    const { framing, context, reflection } = args.research;
    const input = {
      ...framing,
      ...context,
      ...reflection,
    } satisfies PersistInvestigationInputSchemaType;

    try {
      const result = await serverClient.privileged.user.write.investigation({
        investigation: input,
        articleIds,
      });
      if (result.ok === false) {
        thunkAPI.dispatch(
          updateResearchPersistence({
            status: "failed",
            details: result.message,
          }),
        );
        return thunkAPI.rejectWithValue(result.message);
      }

      thunkAPI.dispatch(
        updateResearchPersistence({ status: "ready", data: result }),
      );
      return result.data;
    } catch (err) {
      thunkAPI.dispatch(
        updateResearchPersistence({
          status: "failed",
          details:
            err instanceof Error ? err.message : "Failed to save investigation",
        }),
      );
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to save investigation",
      );
    }
  },
);
