import {
  AUTH_API_CONTRACT,
  INTEGRATIONS_API_CONTRACT,
  PRIVATE_ACCOUNT_API_CONTRACT,
  PRIVATE_BOOKMARKS_API_CONTRACT,
  PRIVATE_INVESTIGATIONS_API_CONTRACT,
  PUBLIC_ARTICLES_API_CONTRACT,
  PUBLIC_USER_API_CONTRACT,
} from "./apiContracts.js";

export const PRIVATE_API_CONFIG = {
  account: PRIVATE_ACCOUNT_API_CONTRACT,
  investigations: PRIVATE_INVESTIGATIONS_API_CONTRACT,
  bookmarks: PRIVATE_BOOKMARKS_API_CONTRACT,
} as const;

export const PUBLIC_API_CONFIG = {
  auth: AUTH_API_CONTRACT,
  user: PUBLIC_USER_API_CONTRACT,

  integrations: INTEGRATIONS_API_CONTRACT,
  articles: PUBLIC_ARTICLES_API_CONTRACT,
} as const;

export const apiContractConfig = {
  private: PRIVATE_API_CONFIG,
  public: PUBLIC_API_CONFIG,
} as const;

export type PrivateApiContract = typeof PRIVATE_API_CONFIG;

export type PublicApiContract = typeof PUBLIC_API_CONFIG;

export type ApiContract = typeof apiContractConfig;
