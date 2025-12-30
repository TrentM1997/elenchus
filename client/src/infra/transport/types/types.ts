export type AuthEndpoint =
    | "/supabaseLogIn"
    | "/createNewUser"
    | "/deleteUser"
    | "/signUserOut"
    | "/resetUserPassword"
    | "/getCurrentUser";

export type ArticleEndpoint =
    | "/articleOperation"
    | "/saveResearch"
    | "/getUserArticles"
    | "/getUserResearch";

export type ApiEndpoint =
    | AuthEndpoint
    | ArticleEndpoint
    | "/newsArticles"
    | "/firecrawl_extractions"
    | "/searchBlueSky"
    | "/sendFeedback";

export type FirecrawlEndpoint = Extract<ApiEndpoint, "/firecrawl_extractions">;

export type FirecrawlPollingEndpoint = `${FirecrawlEndpoint}/${string}`

export type ExtractArticleEndpoints = {
    kickoff: Extract<ApiEndpoint, "/firecrawl_extractions">,
    polling: (jobId: string) => FirecrawlPollingEndpoint
};

export type ArticleEndpointConfig = {
    endpoint: ApiEndpoint,
    credentials: RequestCredentials
}

export type AuthRequestConfig = {
    endpoint: AuthEndpoint,
    credentials: RequestCredentials
};

export type SearchEndpoint = Extract<ApiEndpoint, "/newsArticles">

export type EndpointAndQuery = `${SearchEndpoint}?q=${string}`

export type SearchNewsConfig = {
    endpoint: (query: string) => SearchEndpoint
};


export type SaveArticleResult =
    | { ok: true; id: string }
    | { ok: false; reason: "unauthorized" | "validation" | "unknown" | "network" };