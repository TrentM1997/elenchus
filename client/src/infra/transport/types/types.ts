export type BlueSkyEndpointOption = "/feed" | "search";

export type BlueSkyEndpoint = `/blueSky${BlueSkyEndpointOption}`;

export type ApiEndpoint =
  | AuthEndpoint
  | ArticleEndpoint
  | UserEndpoint
  | BlueSkyEndpoint;

export type FirecrawlEndpoint = Extract<ApiEndpoint, "/firecrawl_extractions">;

export type ExtractArticleEndpoints = {
  kickoff: Extract<ApiEndpoint, ArticleEndpoint>;
  polling: (jobId: string) => Extract<ArticleEndpoint, `"/extract/${string}`>;
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

export type BlueSkyBaseUrl = "/blueSky";

export type ArticlesBaseUrl = "/articles";

export type AuthEndpointOption = "/login" | "/logOut" | "/recover";

export type AuthEndpointBaseUrl = "/auth";

export type LoginUrl =
  `${AuthEndpointBaseUrl}${Extract<AuthEndpointOption, "/login">}`;

export type AuthEndpoint = `/auth${AuthEndpointOption}`;

export type ArticleEndpointOption = "/search" | "/extract/:jobId" | "/extract";

export type ArticleEndpoint = `/articles${ArticleEndpointOption}`;

export type UserEndpoint = `${UserBaseUrl}${UserEndpointOption}`;

export type BookmarksUrls = "/bookmarks" | `/bookmarks/:${string}`;

export type InvestigationsUrl = "/investigations";

export type FeedbackUrl = "/feedback";

export type UserEndpointOption =
  | BookmarksUrls
  | InvestigationsUrl
  | FeedbackUrl;

export type UserBaseUrl = "/user";

export type DeleteBookmarkEndpint =
  `${UserBaseUrl}/${Extract<BookmarksUrls, `/bookmarks/:${string}`>}`;
