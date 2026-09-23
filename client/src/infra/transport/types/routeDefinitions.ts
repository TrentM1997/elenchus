export type BookmarkRoutes = {
  get: { all: "/user/bookmarks"; single: `/user/bookmarks/${string}` };
  post: "/user/bookmarks";
  delete: `/user/bookmarks/${string}`;
};

export type AuthRoutes = {
  recover: "/auth/recover";
  login: "/auth/login";
  logOut: "/auth/logOut";
  signUp: "/auth/signup";
};

export type ArticleRoutes = {
  poll: `/articles/extract/${string}`;
  extract: "/articles/extract";
};

export type IntegrationsRoutes = {
  newsApi: `/articles/search?q=${string}`;
  blueSky: {
    feed: "/blueSky/feed";
    search: `/blueSky/search?q=${string}`;
  };
  wiki: `/wiki?q=${string}`;
};

export type InvestigationsRoute = "/user/investigations";

export type InvestigationRoutes = {
  get: {
    all: InvestigationsRoute;
    single: `${InvestigationsRoute}/${string}`;
  };
  post: InvestigationsRoute;
};

export type UserRoutes = {
  feedback: "/user/feedback";
  passwordReset: "/resetUserPassword";
};

export type AccountRoutes = {
  delete: "/deleteUser";
};

export type PrivateServerClientRoutes = {
  account: AccountRoutes;
  investigations: InvestigationRoutes;
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
      newsApi: "/articles/search?q=",
      blueSky: {
        feed: "/blueSky/feed",
        search: "/blueSky/search?q=",
      },
      wiki: "/wiki?q=",
    },
    articles: {
      poll: `/articles/extract/`,
      extract: "/articles/extract",
    },
  },

  private: {
    account: {
      delete: "/deleteUser",
    },
    investigations: {
      get: {
        all: "/user/investigations",
        single: `/user/investigations/`,
      },
      post: "/user/investigations",
    },
    bookmarks: {
      get: {
        all: "/user/bookmarks",
        single: "/user/bookmarks/",
      },
      post: "/user/bookmarks",
      delete: "/user/bookmarks/",
    },
  },
} as const satisfies ServerClientRoutes;
