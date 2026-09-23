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
    investigations: "/user/investigations",
    bookmarks: {
      get: "/user/bookmarks",
      post: "/user/bookmarks",
      delete: "/user/bookmarks/",
    },
  },
} as const;
