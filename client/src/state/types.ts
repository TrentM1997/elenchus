export type AsyncState<T, TEmptyMessage extends string = "No data found"> =
  | {
      status: "initial";
    }
  | {
      status: "pending";
    }
  | {
      status: "empty";
      message: TEmptyMessage;
    }
  | {
      status: "failed";
      details: string;
    }
  | {
      status: "ready";
      data: T;
    };

export type LocalAsyncState<
  T,
  FailureMessage extends string = "Async operation failed",
> =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | { status: "failed"; message: FailureMessage };
