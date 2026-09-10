import { cleanURL } from "../helpers/cleanUrl";
import { Article, FailedAttempt, FcParam } from "../types/types";

export interface IFirecrawlJobParser {
  reconcileFailed(retrieved: Article[], failed: FailedAttempt[]): void;
  toFailedAttempt(a: FcParam, reason: string): FailedAttempt;
}

export class FirecrawlJobParser implements IFirecrawlJobParser {
  reconcileFailed(retrieved: Article[], failed: FailedAttempt[]): void {
    const success = new Set(retrieved.map((r) => cleanURL(r.article_url)));
    for (let i = failed.length - 1; i >= 0; i--) {
      if (success.has(cleanURL(failed[i].article_url))) failed.splice(i, 1);
    }
  }

  toFailedAttempt(a: FcParam, reason: string): FailedAttempt {
    const cleaned = cleanURL(a.url);
    return {
      title: a.title,
      summary: [{ denied: reason, failedArticle: a.url }],
      logo: a.logo,
      source: a.source,
      date: a.date,
      article_url: cleaned,
    };
  }
}
