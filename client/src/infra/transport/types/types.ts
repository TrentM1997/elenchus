export type AuthEndpointOption = "/login" | "/logOut" | "/recover";

export type AuthEndpoint = `/auth${AuthEndpointOption}`;

export type ArticleEndpointOption = "/search" | "/extract/:jobId" | "/extract";

export type ArticleEndpoint = `/articles${ArticleEndpointOption}`;

export type UserEndpointOption =
  | "/bookmarks"
  | "/bookmarks/:articleId"
  | "/investigations"
  | "/feedback";

export type UserEndpoint = `/user${UserEndpointOption}`;

export type BlueSkyEndpointOption = "/feed" | "search";

export type BlueSkyEndpoint = `/blueSky${BlueSkyEndpointOption}`;

export type ApiEndpoint =
  | AuthEndpoint
  | ArticleEndpoint
  | UserEndpoint
  | BlueSkyEndpoint;

export type FirecrawlEndpoint = Extract<ApiEndpoint, "/firecrawl_extractions">;

export type FirecrawlPollingEndpoint = `${FirecrawlEndpoint}/${string}`;

export type ExtractArticleEndpoints = {
  kickoff: Extract<ApiEndpoint, "/firecrawl_extractions">;
  polling: (jobId: string) => FirecrawlPollingEndpoint;
};

export type ArticleEndpointConfig = {
  endpoint: ApiEndpoint;
  credentials: RequestCredentials;
};

export type AuthRequestConfig = {
  endpoint: AuthEndpoint;
  credentials: RequestCredentials;
};

export type SearchEndpoint = Extract<ArticleEndpoint, "/articles/search">;

export type EndpointAndQuery = `${SearchEndpoint}?q=${string}`;

export type SearchNewsConfig = {
  endpoint: (query: string) => SearchEndpoint;
};

export type SaveArticleResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason: "unauthorized" | "validation" | "unknown" | "network";
    };
