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


export type ArticleEndpointConfig = {
    endpoint: ApiEndpoint,
    credentials: RequestCredentials
}

export type AuthRequestConfig = {
    endpoint: AuthEndpoint,
    credentials: RequestCredentials
};


export type SaveArticleResult =
    | { ok: true; id: string }
    | { ok: false; reason: "unauthorized" | "validation" | "unknown" | "network" };