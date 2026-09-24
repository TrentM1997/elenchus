import type { Static, TSchema } from "@sinclair/typebox";

export type RequestOptions<R> = (R extends {
  bodySchema: infer S extends TSchema;
}
  ? { body: Static<S> }
  : { body?: never }) & {
    signal?: AbortSignal;
  };
