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
