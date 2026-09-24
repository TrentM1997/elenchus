import type { TSchema } from "@sinclair/typebox";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type RouteConfigDefinition = {
  path: string;
  /** Validates the JSON request body. */
  bodySchema?: TSchema;
  /** Validates the named URL query parameters. */
  querySchema?: TSchema;
  /** Validates the named parameters substituted into the route path. */
  paramsSchema?: TSchema;
  outputSchema: TSchema;
  method: HttpMethod;
};

type PublicUserApiConfigKeys = "passwordReset" | "feedback";

export type PublicUserApiContract = Record<
  PublicUserApiConfigKeys,
  RouteConfigDefinition
>;

type AuthApiConfigKeys = "recover" | "login" | "logOut" | "signUp";

export type AuthApiContract = Record<AuthApiConfigKeys, RouteConfigDefinition>;

type BlueSkyApiConfigKeys = "feed" | "search";

type BlueSkyApiContract = Record<BlueSkyApiConfigKeys, RouteConfigDefinition>;

export type IntegrationsApiContract = {
  newsApi: RouteConfigDefinition;
  wiki: RouteConfigDefinition;
  blueSky: BlueSkyApiContract;
};

type PublicArticlesApiConfigKeys = "poll" | "extract";

export type PublicArticlesApiContract = Record<
  PublicArticlesApiConfigKeys,
  RouteConfigDefinition
>;

export type PrivateAccountApiContract = Record<"delete", RouteConfigDefinition>;

export type PrivateInvestigationsApiContract = {
  get: Record<"all" | "single", RouteConfigDefinition>;
  post: RouteConfigDefinition;
};

export type PrivateBookmarksApiContract = {
  get: Record<"all" | "single", RouteConfigDefinition>;
  post: RouteConfigDefinition;
  delete: RouteConfigDefinition;
};
