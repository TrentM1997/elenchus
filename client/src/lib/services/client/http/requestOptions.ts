import type { RouteConfigDefinition } from "@elenchus/contracts";
import type { Static, TSchema } from "@sinclair/typebox";

type BodyOptions<R extends RouteConfigDefinition> = R extends {
  bodySchema: infer S extends TSchema;
}
  ? { body: Static<S> }
  : { body?: never };

export type QueryOptions<R extends RouteConfigDefinition> = R extends {
  querySchema: infer S extends TSchema;
}
  ? { query: Static<S> }
  : { query?: never };

type ParamsOptions<R extends RouteConfigDefinition> = R extends {
  paramsSchema: infer S extends TSchema;
}
  ? { params: Static<S> }
  : { params?: never };

export type RequestOptions<R extends RouteConfigDefinition> = BodyOptions<R> &
  QueryOptions<R> &
  ParamsOptions<R> & {
    signal?: AbortSignal;
  };
