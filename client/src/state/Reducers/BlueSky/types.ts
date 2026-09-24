import { AsyncState } from "@/state/types";
import {
  BlueSkyPostSchemaType,
  SplitBlueSkyFeedSchemaType,
} from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";

export type PopoverXY = {
  x: number | null;
  y: number | null;
};

export type Dimensions = {
  w: number | null;
  h: number | null;
};

export type SelectedPost =
  | { status: "initial" }
  | { status: "ready"; data: BlueSkyPostSchemaType };

export type PopoverPost =
  | { status: "initial" }
  | { status: "ready"; data: BlueSkyPostSchemaType["record"]["text"] };

export type BlueSkyPosts = AsyncState<SplitBlueSkyFeedSchemaType>;
