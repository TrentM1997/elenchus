/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import { Session } from "@supabase/supabase-js";
import { Extracts } from "./ReduxToolKit/Reducers/Investigate/Review";
import React, { ReactEventHandler, ReactNode, SetStateAction } from "react";
import { User } from "@supabase/supabase-js";
import { SigninStatus } from "./hooks/useSignIn";
import type { Article } from "./ReduxToolKit/Reducers/Investigate/Reading";
import { ActiveTab } from "./ReduxToolKit/Reducers/UserContent/DashboardTabs";
import type { BlueSkyPost } from "./ReduxToolKit/Reducers/BlueSky/BlueSkySlice";

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_SERVER_PORT: string;
    // Add other public environment variables here as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface State {
    statement: string,
    status: string,
    identifier: string,
    biases: string,
    premise: string,
  }

  interface PremiseProps {
    biases: string,
    statement: string,
    identifier: string,
    dispatch: any,
    status: string
  }

  interface Image {
    img: string,
    width: number,
    height: number
  }

  interface Perspectives {
    perspective: string
  }

  interface ArticleType {
    date_published: string,
    description: string,
    image: string,
    keywords: string[]
    name: string,
    provider: string,
    url: string,
    logo: string
  }

  interface OptionsTypes {
    method: string,
    headers: HeadersInit,
    signal?: AbortSignal
  }

  interface ForSummaryData {
    url: string,
    source: string,
    date: string,
    logo: string
  }

  interface SelectedArticle {
    url: string,
    source: string,
    date: string,
    logo: string,
    title: string,
    image: string,

  }


  interface Help {
    heading: string,
    explanation: string

  }

  type Bias = | "Left"
    | "Left-Center"
    | "Center"
    | "Right-Center"
    | "Right"
    | "Conspiracy-Pseudoscience"
    | "Questionable"
    | "LeastBiased"
    | "Satire"
    | "Pro-Science"
    | "Unknown"
    | null;

  interface BiasCounts {
    Left: number | null,
    Right: number | null,
    Center: number | null,
    Conspiracy: number | null,
    Questionable: number | null,
    Satire: number | null,
    Scientific: number | null,
  }

  interface SavedArticle {
    title: string,
    provider: string,
    authors: string[] | string,
    article_url: string,
    image_url: string,
    date_published: string,
    fallbackDate: string | null,
    summary: any,
    text: string,
    id: number | null,
    factual_reporting?: string | null,
    bias?: Bias,
    country?: string | null
  }



  interface Calculations {
    change: number | null,
    valid: number | null,
    neutral: number | null,
    needMore: number | null
  }

  interface PostsProps {
    posts: any[] | null,
    context?: string,
    shouldRedirect: boolean,
    shouldAnimate?: boolean
  }


  interface Tooltips {
    readingTooltip: boolean,
    selectingTooltip: boolean,

  }

  interface SupabaseUser {
    id: string;
    aud: string;
    role: string;
    email: string;
    created_at: string;
    confirmed_at: string | null;
    last_sign_in_at: string | null;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: Record<string, any>;
    identities: Array<{
      id: string;
      user_id: string;
      identity_data: {
        email: string;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string | null;
      created_at: string;
      updated_at: string;
    }>;
    phone: string;
    email_confirmed_at: string | null;
    is_anonymous: boolean;
  }

  interface ResetPW {
    message: string,
    data: SupabaseUser | null
  }

  interface Investigation {
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
    sources: string[];
    wikipedia_extracts: any;
  }

  interface ScrapedArticle {
    article_abstract: string | null;
    article_authors: string[];
    article_html: string;
    article_image: string;
    article_pub_date: string;
    article_text: string;
    article_title: string;
    article_url: string;
    bias: string;
    cleanedAuthors: string[][];
    country: string;
    date: string;
    factual_reporting: string;
    logo: string;
    source: string;
    summary: {
      heading: string;
      text: string;
    }[];
  }

  interface ArticleToSave {
    article_title: string;
    source: string;
    article_image: string;
    article_text: string;
    article_authors: string[] | string;
    date_published?: string | null;
    article_pub_date: string;
    article_url: string;
    summary: string;
    id: string | number;
    factual_reporting?: string | null;
    bias?: Bias;
    country?: string | null;
  }

  interface SignOutResponse {
    loggedOut: boolean,
    data: any
  }

  interface TipTapProps {
    context: string | null,
    setterFunction: any,
    id?: 'takeaway' | 'step1' | 'step4'
  }

  interface AuthStatus {
    pending: string,
    successful: string,
    failed: string
  }

  interface AuthNotificationProps {
    id?: 'login' | 'signout',
    complete?: boolean | null,
    setterFunction?: any,
    authStatus?: SigninStatus,
    status?: SigninStatus,
    redirect?: Function,
    loginStatus?: SigninStatus,
    setStatus?: React.Dispatch<SetStateAction<SigninStatus>>,
    action?: string
  }

  interface SaveArticleButton {
    article: Article,
    open: boolean,
    reviewing?: boolean
  }

  interface SidebarItemData {
    title: string,
    step: number,
    data: string | null,
    titleTwo?: string,
    dataTwo?: string | null
  }

  interface LinkProps {
    highlight?: boolean,
    article: ArticleType,
    index?: number,
    isPriority?: boolean,
    chooseArticle?: (article: ArticleType) => () => void,
    showGetArticlesModal?: boolean,
    mute?: boolean,
    chosenArticles?: Array<SelectedArticle>,
    inModal?: boolean
  }

  interface ArticleOperationData {
    message: string,
    id: number | null
  }

  interface SavedResponse {
    data: ArticleOperationData,
    message: string,
    status: 'success' | 'failed'
  }

  interface WikiTerm {
    article_url?: string,
    data?: Extracts
  }

  interface LoadedArticle {
    handleArticleSelection: VoidFunction,
    handleImageLoad: ReactEventHandler<HTMLImageElement>,
    article: any
  }

  interface ChartFallbackProps {
    message: string
    actionText?: string
    direction?: string
    children?: ReactNode
  }

  interface SupabaseLoginResponse {
    sess: Session;
    userContent: UserContent;
  }



  interface LoginResponse {
    message: string,
    session: SupabaseLoginResponse | null
  }

  interface LoginFormProps {
    successful?: boolean | null,
    acceptedInput: boolean | null,
    setUserPassword: (userPassword: string) => void,
    setUserEmail: (userEmail: string) => void,
    validEmail: boolean | null,
    submitAuth: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>,
    status?: SigninStatus,

  }

  type DashboardOptionName = ActiveTab | 'Sign Out'

  interface DashboardOption {
    name: DashboardOptionName,
    children: ReactNode,
    tab: ActiveTab,
    onSelect: () => void,
    active: boolean
  }

  interface HelpModal {
    info: Help[],
    handleExpand: Function,
    isOpen: boolean,
    activeTab: Help,
    setActiveTab: (activeTab: Help) => void,
  }

  interface RecoverUserResults {
    data: RecoveredUser
  }

  interface RecoveredUser {
    user: User
    userArticles: SavedArticleRes | null;
    userResearch: Investigation[] | null;
  }

  interface UserContent {
    userArticles: SavedArticleRes | null;
    userResearch: Investigation[] | null;
  }

  interface SavedArticleRes {
    articles: SavedArticle[],
    articleMap: Map<string, SavedArticle>
  }




  interface NotifySaved {
    setNotification: React.Dispatch<React.SetStateAction<string | null>>,
    message: string | null
  }

  interface WikiTypes {
    gettingSelection: boolean,
    selectedText: string | null,
    status: string,
    displayWikiModal: boolean
  }

  interface ArticleSavedComponent {
    children: ReactNode[]
  }


  interface Icon {
    active: boolean
  }

  interface SignInHook {
    loggingIn: boolean | null,
    setLoggingIn: React.Dispatch<React.SetStateAction<boolean>>,
    successful: boolean | null
  }

  interface IntegrityRatings {
    veryHigh: number;
    high: number;
    mostlyFactual: number;
    mixed: number;
    low: number;
    veryLow: number;
    conspiracy: number;
    unknown: number;
  }

  interface WebWorkerResponse {
    type: string;
    chartData: IntegrityRatings | number[] | null;
  }

  type ChartType = 'IntegritySS' | 'BiasSS';

  interface WebWorkerRequest {
    input: any,
    type: ChartType,
    signature?: string
  }

  interface StatBreakdownTypes {
    percentChanged: number | null,
    validated: number | null,
    neutral: number | null,
    neededMore: number | null
  }

  type DeleteStatus = "deleted" | "saved" | "noop" | "error";

  interface SavedArticleRes {
    data: {
      articles: SavedArticle[],
      articleMap: Map<string, SavedArticle>
    }
  }

  interface BSPostProps {
    post: BlueSkyPost,
    choosePost?: (post: BlueSkyPost) => () => Promise<void>,
    inPopover?: boolean
  }


  type ValidationStatus = 'idle' | 'valid' | 'rejected';

  type SignupFields = {
    email: string | null,
    password: string | null,
    confirmPw: string | null
  };

  type FieldStatus = {
    e: ValidationStatus,
    p: ValidationStatus,
    c: ValidationStatus
  };

  interface SignupValidationHook {
    fieldStatus: FieldStatus,
    canSubmit: boolean,
    setFieldValue: (key: keyof SignupFields, value: string) => void,
    fields: SignupFields
  }
}


export {
  ArticleType, OptionsTypes, SelectedArticle, Perspectives, State, PremiseProps, Help, SavedArticle,
  Calculations, PostsProps, SupabaseUser, ResetPW, Investigation, ScrapedArticle, TipTapProps, AuthStatus, AuthNotificationProps,
  Tooltips, SidebarItemData, LinkProps, WikiTerm, Bias, BiasCounts, LoadedArticle, ChartFallbackProps,
  UserContent, LoginResponse, LoginFormProps, DashboardOption, HelpModal, NotifySaved, SaveArticleButton,
  WikiTypes, ArticleSavedComponent, Icon, ArticleToSave, SignInHook, WebWorkerResponse, WebWorkerRequest, ChartType, StatBreakdownTypes,
  DeleteStatus, SavedArticleRes, RecoverUserResults, BSPostProps, ValidationStatus,
  FieldStatus, SignupValidationHook, SignupFields
};
