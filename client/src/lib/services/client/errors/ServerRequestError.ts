export type RequestMethod = "GET" | "POST" | "DELETE";

type RequestFailure =
  | {
      kind: "network";
      status?: never;
    }
  | {
      kind: "http";
      status: number;
      serverCode?: string;
      details?: unknown;
    }
  | {
      kind: "invalid-json";
      status: number;
    }
  | {
      kind: "invalid-response";
      status: number;
      details?: unknown;
    };

export type ServerRequestErrorContext = {
  method: RequestMethod;
  url: string;
} & RequestFailure;

export class ServerRequestError extends Error {
  public readonly context: ServerRequestErrorContext;

  constructor(
    message: string,
    context: ServerRequestErrorContext,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ServerRequestError";
    this.context = context;
  }
}
