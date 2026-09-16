export type BookmarkRoutes = {
  get: "/user/bookmarks";
  post: "/user/bookmarks";
  delete: `/user//bookmarks/:${string}`;
};

export type AuthRoutes = {
  recover: "/auth/recover";
  login: "/auth/login";
  logOut: "/auth/logOut";
  signUp: "/auth/signup";
};

export type ArticleRoutes = {
  poll: `/articles/extract/:${string}`;
  extract: "/articles/extract";
};

export type IntegrationsRoutes = {
  newsApi: "/articles/search";
  blueSky: {
    feed: "/blueSky/feed";
    search: "/blueSky/search";
  };
};

export type InvestigationsRoute = "/user/investigations";

export type UserRoutes = {
  feedback: "/user/feedback";
  passwordReset: "/resetUserPassword";
};

export type AccountRoutes = {
  delete: "/deleteUser";
};

export type PrivateServerClientRoutes = {
  account: AccountRoutes;
  investigations: InvestigationsRoute;
  bookmarks: BookmarkRoutes;
};

export type PublicServerClientRoutes = {
  auth: AuthRoutes;
  user: UserRoutes;
  integrations: IntegrationsRoutes;
  articles: ArticleRoutes;
};

export type ServerClientRoutes = {
  public: PublicServerClientRoutes;
  private: PrivateServerClientRoutes;
};

type RouteStrings<T> = T extends string
  ? T
  : T extends object
    ? {
        [K in keyof T]: RouteStrings<T[K]>;
      }[keyof T]
    : never;

export type ValidServerRoute = RouteStrings<ServerClientRoutes>;

export const serverClientRoutes = {
  public: {
    auth: {
      recover: "/auth/recover",
      login: "/auth/login",
      logOut: "/auth/logOut",
      signUp: "/auth/signup",
    },
    user: {
      feedback: "/user/feedback",
      passwordReset: "/resetUserPassword",
    },
    integrations: {
      newsApi: "/articles/search",
      blueSky: {
        feed: "/blueSky/feed",
        search: "/blueSky/search",
      },
    },
    articles: {
      poll: "/articles/extract/:id",
      extract: "/articles/extract",
    },
  },

  private: {
    account: {
      delete: "/deleteUser",
    },
    investigations: "/user/investigations",
    bookmarks: {
      get: "/user/bookmarks",
      post: "/user/bookmarks",
      delete: "/user//bookmarks/:id",
    },
  },
} as const satisfies ServerClientRoutes;
