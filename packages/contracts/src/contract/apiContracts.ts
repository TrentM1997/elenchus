import { Type } from "@sinclair/typebox";
import {
  GetArticleResponseSchema,
  ExtractArticlesResponseSchema,
  ExtractionJobSchema,
  ScrapeRequestSchema,
} from "../schemas/articles/ArticleSchema.js";
import {
  BookmarkArticleIdSchema,
  BookmarkResponseSchema,
  BookmarkedArticlesResponseSchema,
  DeleteBookmarkResponseSchema,
} from "../schemas/articles/BookmarkSchema.js";
import { DeleteAccountResponseSchema } from "../schemas/auth/DeleteAccountResponseSchema.js";
import {
  InvestigationSaveResponse,
  InvestigationsSavedReponseSchema,
  PersistInvestigationInputSchema,
} from "../schemas/investigations/InvestigationSchema.js";
import { SearchResultsResponseSchema } from "../schemas/articles/BrowsingOptionSchema.js";
import {
  CreateUserResponseSchema,
  LoginCredentialsSchema,
  LoginResponseSchema,
  LogOutResultSchema,
  PasswordResetRequestSchema,
  RecoverSessionResponseSchema,
  ResetPasswordResponseSchema,
} from "../schemas/auth/AuthSchemas.js";
import {
  FeedbackReqSchema,
  FeedbackResponseSchema,
} from "../schemas/auth/FeedbackSchema.js";
import {
  BlueSkyPostSchemaArray,
  SplitBlueSkyFeedSchema,
} from "../schemas/integrations/BlueSkySchemas.js";
import { SearchQuerySchema } from "../schemas/integrations/SearchQuerySchema.js";
import { WikiResponseSchema } from "../schemas/integrations/WikipediaExtractSchemas.js";
import {
  PrivateAccountApiContract,
  PrivateInvestigationsApiContract,
  PrivateBookmarksApiContract,
  AuthApiContract,
  IntegrationsApiContract,
  PublicArticlesApiContract,
  PublicUserApiContract,
} from "./types.js";

export const AUTH_API_CONTRACT = {
  recover: {
    path: "/auth/recover",
    method: "POST",
    outputSchema: RecoverSessionResponseSchema,
  },
  login: {
    path: "/auth/login",
    method: "POST",
    bodySchema: LoginCredentialsSchema,
    outputSchema: LoginResponseSchema,
  },
  logOut: {
    path: "/auth/logOut",
    method: "POST",
    outputSchema: LogOutResultSchema,
  },
  signUp: {
    path: "/auth/signup",
    method: "POST",
    bodySchema: LoginCredentialsSchema,
    outputSchema: CreateUserResponseSchema,
  },
} as const satisfies AuthApiContract;

export const PUBLIC_USER_API_CONTRACT = {
  feedback: {
    path: "/user/feedback",
    method: "POST",
    bodySchema: Type.Object({ feedback: FeedbackReqSchema }),
    outputSchema: FeedbackResponseSchema,
  },
  passwordReset: {
    path: "/resetUserPassword",
    method: "POST",
    bodySchema: PasswordResetRequestSchema,
    outputSchema: ResetPasswordResponseSchema,
  },
} as const satisfies PublicUserApiContract;

export const INTEGRATIONS_API_CONTRACT = {
  newsApi: {
    path: "/articles/search",
    method: "GET",
    querySchema: Type.Object({ q: SearchQuerySchema }),
    outputSchema: SearchResultsResponseSchema,
  },
  wiki: {
    path: "/wiki",
    method: "GET",
    querySchema: Type.Object({ q: SearchQuerySchema }),
    outputSchema: WikiResponseSchema,
  },
  blueSky: {
    feed: {
      path: "/blueSky/feed",
      method: "GET",
      outputSchema: SplitBlueSkyFeedSchema,
    },
    search: {
      path: "/blueSky/search",
      method: "GET",
      querySchema: Type.Object({ q: SearchQuerySchema }),
      outputSchema: SplitBlueSkyFeedSchema,
    },
  },
} as const satisfies IntegrationsApiContract;

export const PUBLIC_ARTICLES_API_CONTRACT = {
  extract: {
    path: "/articles/extract",
    method: "POST",
    bodySchema: ScrapeRequestSchema,
    outputSchema: ExtractArticlesResponseSchema,
  },
  poll: {
    path: "/articles/extract/:jobId",
    method: "GET",
    paramsSchema: Type.Object({ jobId: Type.String({ minLength: 1 }) }),
    outputSchema: ExtractionJobSchema,
  },
} as const satisfies PublicArticlesApiContract;

export const PRIVATE_ACCOUNT_API_CONTRACT = {
  delete: {
    path: "/deleteUser",
    method: "POST",
    bodySchema: LoginCredentialsSchema,
    outputSchema: DeleteAccountResponseSchema,
  },
} as const satisfies PrivateAccountApiContract;

// URL parameters arrive as strings; handlers convert these IDs to numbers.
const IdPathParamSchema = Type.String({ pattern: "^[0-9]+$" });

export const PRIVATE_INVESTIGATIONS_API_CONTRACT = {
  get: {
    all: {
      path: "/user/investigations",
      method: "GET",
      outputSchema: InvestigationsSavedReponseSchema,
    },
    single: {
      path: "/user/investigations/:investigationId",
      method: "GET",
      paramsSchema: Type.Object({ investigationId: IdPathParamSchema }),
      outputSchema: InvestigationSaveResponse,
    },
  },
  post: {
    path: "/user/investigations",
    method: "POST",
    bodySchema: PersistInvestigationInputSchema,
    outputSchema: InvestigationSaveResponse,
  },
} as const satisfies PrivateInvestigationsApiContract;

export const PRIVATE_BOOKMARKS_API_CONTRACT = {
  get: {
    all: {
      path: "/user/bookmarks",
      method: "GET",
      outputSchema: BookmarkedArticlesResponseSchema,
    },
    single: {
      path: "/user/bookmarks/:articleId",
      method: "GET",
      paramsSchema: Type.Object({ articleId: IdPathParamSchema }),
      outputSchema: GetArticleResponseSchema,
    },
  },
  post: {
    path: "/user/bookmarks",
    method: "POST",
    bodySchema: Type.Object({ article_id: BookmarkArticleIdSchema }),
    outputSchema: BookmarkResponseSchema,
  },
  delete: {
    path: "/user/bookmarks/:articleId",
    method: "DELETE",
    paramsSchema: Type.Object({ articleId: IdPathParamSchema }),
    outputSchema: DeleteBookmarkResponseSchema,
  },
} as const satisfies PrivateBookmarksApiContract;
