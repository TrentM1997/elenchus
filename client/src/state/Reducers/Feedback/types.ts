export type FeedbackFormState =
  | { status: "initial" }
  | { status: "showing" }
  | { status: "ready"; data: { email: string; message: string } };
