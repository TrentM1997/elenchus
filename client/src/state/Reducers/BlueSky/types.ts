import { AsyncState } from "@/state/types";
import {
  BlueSkyPostSchemaType,
  SplitBlueSkyFeedSchemaType,
} from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";

export type SelectedPost =
  | { status: "initial" }
  | { status: "ready"; data: BlueSkyPostSchemaType };

export type BlueSkyPosts = AsyncState<
  SplitBlueSkyFeedSchemaType,
  "Search yielded 0 results"
>;
