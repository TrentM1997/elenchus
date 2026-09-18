export type PrivateAPIRoutes = {
  account: {
    delete: "/deleteUser";
  };
  investigations: "/user/investigations";
  bookmarks: {
    get: "/user/bookmarks";
    post: "/user/bookmarks";
    delete: "/user/bookmarks/:articleId";
  };
};

export type PublicAPIRoutes = {
  auth: {
    recoverSession: "/auth/recover";
    login: "/auth/login";
    logOut: "/auth/logOut";
    signUp: "/auth/signup";
  };
  user: {
    feedback: "/user/feedback";
    passwordReset: "/resetUserPassword";
  };
  integrations: {
    newsApi: "/articles/search";
    wiki: "/wiki";
    blueSky: {
      feed: "/blueSky/feed";
      search: "/blueSky/search";
    };
  };
  articles: {
    poll: "/articles/extract/:jobId";
    extract: "/articles/extract";
  };
};

export const PUBLIC_API_ROUTES = {
  auth: {
    recoverSession: "/auth/recover",
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
    wiki: "/wiki",
    blueSky: {
      feed: "/blueSky/feed",
      search: "/blueSky/search",
    },
  },
  articles: {
    poll: "/articles/extract/:jobId",
    extract: "/articles/extract",
  },
} as const satisfies PublicAPIRoutes;

export const PRIVATE_API_ROUTES = {
  account: {
    delete: "/deleteUser",
  },
  investigations: "/user/investigations",
  bookmarks: {
    get: "/user/bookmarks",
    post: "/user/bookmarks",
    delete: "/user/bookmarks/:articleId",
  },
} as const satisfies PrivateAPIRoutes;
