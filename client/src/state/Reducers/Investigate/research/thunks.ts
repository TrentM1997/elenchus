import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverClient } from "@/lib/services/client/serverClient";
import { UserResearchType } from "./types";
import {
  ExtractsToPersistSchemaType,
  PersistInvestigationInputSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { updateResearchPersistence } from "./ResearchSlice";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { NotesInputSchemaType } from "@elenchus/contracts/schemas/investigations/NoteSchema";

export const saveInvgestigation = createAsyncThunk(
  "ResearchSlice/saveInvgestigation",
  async (
    args: {
      research: Extract<UserResearchType, { phase: "completed" }>["data"];
      articleIds: ArticleSchemaType["id"][];
      extracts: ExtractsToPersistSchemaType;
      notes?: NotesInputSchemaType;
    },
    thunkAPI,
  ) => {
    thunkAPI.dispatch(updateResearchPersistence({ status: "pending" }));
    const { articleIds, extracts, notes } = args;
    const { framing, reflection } = args.research;
    const input = {
      ...framing,
      ...reflection,
    } satisfies PersistInvestigationInputSchemaType;

    try {
      const result = await serverClient.privileged.user.write.investigation({
        investigation: input,
        articleIds,
        extracts,
        notes,
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
        updateResearchPersistence({ status: "ready", data: result.data }),
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
