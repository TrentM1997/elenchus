export interface FailedAttempt {
  title: string;
  summary: {
    denied: string;
    failedArticle: string;
  }[];
  logo: string;
  source: string;
  date: string;
  article_url: string;
}
