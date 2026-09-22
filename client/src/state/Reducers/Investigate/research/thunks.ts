import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverClient } from "@/lib/services/client/serverClient";
import { UserResearchType } from "./types";
import { PersistInvestigationInputSchemaType } from "@/lib/schemas/investigations/InvestigationSchema";
import { updateResearchPersistence } from "./ResearchSlice";

export const saveInvgestigation = createAsyncThunk(
  "",
  async (
    research: Extract<UserResearchType, { phase: "completed" }>["data"],
    thunkAPI,
  ) => {
    thunkAPI.dispatch(updateResearchPersistence({ status: "pending" }));

    const { framing, context, reflection } = research;
    const input = {
      ...framing,
      ...context,
      ...reflection,
    } satisfies PersistInvestigationInputSchemaType;

    try {
      const result =
        await serverClient.privileged.user.write.investigation(input);
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
          details: "Failed to save investigation",
        }),
      );
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to save investigation",
      );
    }
  },
);
