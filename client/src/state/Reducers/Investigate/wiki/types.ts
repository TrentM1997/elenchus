export type WikipediaToolState =
  | { status: "closed" }
  | { status: "highlight" }
  | { status: "confirm"; data: string }
  | { status: "submitted" };
