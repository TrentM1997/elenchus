import { Database } from "../../../../types/databaseInterfaces.js";
import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../../../core/validation/validateOrThrow.js";
import {
  ArticleSchemaType,
  ArticleSchema,
} from "../../../../schemas/ArticleSchema.js";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";

export type InsertableArticleType =
  Database["public"]["Tables"]["articles"]["Insert"];

type InsertableBookmark = Database["public"]["Tables"]["bookmarks"]["Insert"];

export interface IArticlesDbParser {
  toInsertableBookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): InsertableBookmark;
  validateArticleInput(article: unknown): ArticleSchemaType;
  validateArticleSelected(article: unknown): ArticleSchemaType;
  toInsertableArticle(article: ArticleSchemaType): InsertableArticleType;
  validateArticles(results: unknown[]): ArticleSchemaType[];
}

export class ArticlesDbParser implements IArticlesDbParser {
  toInsertableBookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): InsertableBookmark {
    return {
      user_id,
      article_id,
    };
  }

  validateArticles(results: unknown[]): ArticleSchemaType[] {
    const articles = [];

    for (const result of results) {
      const article = validateServerOrThrow(ArticleSchema, result);
      articles.push(article);
    }
    return articles;
  }

  validateArticleInput(article: unknown): ArticleSchemaType {
    return validateOrThrow(ArticleSchema, article);
  }

  validateArticleSelected(article: unknown): ArticleSchemaType {
    return validateServerOrThrow(ArticleSchema, article);
  }

  toInsertableArticle(article: ArticleSchemaType): InsertableArticleType {
    const {
      full_text,
      article_url,
      image_url,
      summary,
      title,
      date_published,
      provider,
      fallbackDate,
      factual_reporting,
      bias,
      country,
    } = article;
    const date = date_published ?? fallbackDate;
    const authorsDto =
      typeof article.authors === "string"
        ? [article.authors]
        : (article.authors ?? null);

    return {
      title: title,
      image_url: image_url,
      provider: provider,
      full_text: full_text,
      authors: authorsDto,
      date_published: date ?? null,
      article_url: article_url,
      summary: summary,
      bias: bias,
      factual_reporting: factual_reporting,
      country: country,
    };
  }
}
