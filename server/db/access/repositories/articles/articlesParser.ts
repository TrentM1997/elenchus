import { Database } from "../../../../types/databaseInterfaces";
import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../../../core/validation/validateOrThrow";
import {
  ArticleSchemaType,
  ArticleSchema,
} from "../../../../schemas/ArticleSchema";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization";
import {
  BookmarkSchema,
  BookmarkSchemaType,
} from "../../../../schemas/BookmarkSchema";

export type InsertableArticleType =
  Database["public"]["Tables"]["articles"]["Insert"];

type InsertableBookmark = Database["public"]["Tables"]["bookmarks"]["Insert"];

export interface IArticlesDbParser {
  toInsertableBookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): InsertableBookmark;
  validateBookMark(bookmark: unknown): BookmarkSchemaType;
  validateArticleInput(article: unknown): ArticleSchemaType;
  validateArticleSelected(article: unknown): ArticleSchemaType;
  toInsertableArticle(article: ArticleSchemaType): InsertableArticleType;
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

  validateBookMark(bookmark: unknown): BookmarkSchemaType {
    return validateServerOrThrow(BookmarkSchema, bookmark);
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
