import { Database } from "../../../../types/databaseInterfaces.js";
import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../../../core/validation/validateOrThrow.js";
import { ArticleSchemaType, ArticleSchema } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InsertableArticleSchema, InsertableArticleSchemaType } from "../../../../schemas/ArticleSchema.js";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";

export type InsertableArticleType =
  Database["public"]["Tables"]["articles"]["Insert"];

type InsertableBookmark = Database["public"]["Tables"]["bookmarks"]["Insert"];

export interface IArticlesDbParser {
  toInsertableBookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): InsertableBookmark;
  validateArticleInput(article: unknown): InsertableArticleSchemaType;
  validateArticleSelected(article: unknown): ArticleSchemaType;
  toInsertableArticle(
    article: InsertableArticleSchemaType,
  ): InsertableArticleType;
  validateArticles(results: unknown[]): ArticleSchemaType[];
}

export class ArticlesDbParser implements IArticlesDbParser {
  public toInsertableBookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): InsertableBookmark {
    return {
      user_id,
      article_id,
    };
  }

  public validateArticles(results: unknown[]): ArticleSchemaType[] {
    const articles = [];

    for (const result of results) {
      const article = validateServerOrThrow(ArticleSchema, result);
      articles.push(article);
    }
    return articles;
  }

  public validateArticleInput(article: unknown): InsertableArticleSchemaType {
    return validateOrThrow(InsertableArticleSchema, article);
  }

  public validateArticleSelected(article: unknown): ArticleSchemaType {
    return validateServerOrThrow(ArticleSchema, article);
  }

  public toInsertableArticle(
    article: InsertableArticleSchemaType,
  ): InsertableArticleType {
    const {
      full_text,
      article_url,
      image_url,
      summary,
      title,
      date_published,
      provider,
      factual_reporting,
      bias,
      country,
    } = article;
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
      date_published: date_published,
      article_url: article_url,
      summary: summary,
      bias: bias,
      factual_reporting: factual_reporting,
      country: country,
    };
  }
}
