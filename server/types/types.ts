import { SupabaseClient, User, Session } from "@supabase/supabase-js";

export interface ChangePasswordBody {
    email: string,
    newPassword: string
};

export interface ChangePasswordSuccess {
    message: 'success';
    data: User | null;
};

export interface ChangePasswordError {
    status: string;
    data: null;
};

export interface SignUpRequestBody {
    email: string,
    password: string
};

export interface NewUser {
    message: string,
    data: User | null
};

export interface FeedbackBody {
    email?: string | null,
    message: string
};

export interface FeedbackResponse {
    result: string
};

export interface Investigation {
    idea: string;
    premises: string | null;
    initial_perspective: string | null;
    biases: string | null;
    ending_perspective: string | null;
    new_concepts: any;
    changed_opinion: any;
    takeaway: string | null;
    had_merit: boolean | null;
    user_id: string;
    sources: string[] | null;
    wikipedia_extracts: any;
};

export type InvestigationBody = {
    investigation: Investigation
};

export interface ArticleSaveBody {
    articleExists: boolean
};

export interface ArticleSaveResponse {
    saved: boolean,
    data: any
}

//export interface SavedArticle {
//    title: string,
//    provider: string,
//    authors: string[],
//    url: string,
//    image_url: string,
//    date: string,
//    fallbackDate: string | null,
//    summary: any,
//    text: string,
//    id: string,
//    factual_reporting?: string | null,
//    bias?: string | null,
//    country?: string | null
//};


export interface Article {
    title: string,
    provider: string,
    authors: string[] | string,
    article_url: string,
    image_url: string,
    date_published: string,
    fallbackDate: string | null,
    summary: any,
    full_text: string,
    logo: string,
    id: string | number | null,
    factual_reporting?: string | null,
    bias: Bias,
    country?: string | null
}


export interface BiasInfo {
    bias: Bias | null;
    factual_reporting: string | null;
    country: string | null;
}

export type MBFC = Map<string, BiasInfo>

export type Bias = | "Left"
    | "Left-Center"
    | "Center"
    | "Right-Center"
    | "Right"
    | "Conspiracy-Pseudoscience"
    | "Questionable"
    | "Least Biased"
    | "Satire"
    | "Pro-Science"
    | "Unknown"
    | null;

export interface SavedArticle {
    title: string,
    provider: string,
    authors: string[] | string,
    url: string,
    image_url: string,
    date: string,
    fallbackDate: string | null,
    summary: any,
    text: string,
    id: string,
    factual_reporting?: string | null,
    bias?: Bias,
    country?: string | null
}

export interface FirecrawlContent {
    content_markdown: string;
};

export interface FirecrawlResponse {
    metadata: { /* massive meta tag map */ },
    json: FirecrawlContent
};

export type FirecrawlResults = Array<FirecrawlResponse>;

export interface ArticleBody {
    articleExists: boolean,
    dataToSave: SavedArticle
};

export interface GetLinkBody {
    email: string
};

export interface GetLinkResponse {
    message: string,
    data: any
};

export interface LoginBody {
    email: string,
    password: string
};

export interface SupabaseSession {
    supabase: SupabaseClient,
    user: User
};

export interface CurrentUser {
    user: User
};

export interface DeleteUserBody {
    email: string,
    password: string
};


export interface ScrapedArticle {
    title: string,
    provider: string,
    authors: string[] | string,
    article_url: string,
    image_url: string,
    date_published: string,
    fallbackDate: string | null,
    summary: any,
    full_text: string,
    logo: string,
    id: number | null,
    factual_reporting?: string | null,
    bias: Bias,
    country?: string | null
};

export interface FailedAttempt {
    title: string;
    summary: {
        denied: string;
        failedArticle: string;
    }[] | null;
    logo: string;
    source: string;
    date: string;
    article_url: string;
};



export interface TldrRequest {
    url: string,
    source: string,
    date: string,
    logo: string,
    title: string,
    image: string
};


export interface FcParam {
    url: string,
    source: string,
    date: string,
    logo: string,
    title: string,
    image: string
};


export interface MappedTldrRequests {
    retrieved: ScrapedArticle[] | null,
    rejected: FailedAttempt[];
};

export interface UserContentResponse {
    message: string,
    data: SavedArticle[] | null
};

export interface UserContent {
    userArticles: SavedArticleRes | null;
    userResearch: Investigation[] | null;
}

export interface SupabaseLoginResponse {
    sess: Session;
    userContent: UserContent;
}

export interface SavedArticleRes {
    articles: SavedArticle[],
    articleMap: Map<string, SavedArticle>
}