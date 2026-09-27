import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

interface ArticleSource {
  id: string | null;
  name: string;
}

interface NewsArticle {
  source: ArticleSource;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

const NewsApiResultItemSourceSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Null()]),
  name: Type.String(),
});

export const NewsApiResultItemSchema = Type.Object({
  source: NewsApiResultItemSourceSchema,
  author: Type.Union([Type.String(), Type.Null()]),
  title: Type.String(),
  description: Type.String(),
  url: Type.String(),
  urlToImage: Type.Union([Type.String(), Type.Null()]),
  publishedAt: Type.String(),
  content: Type.Union([Type.String(), Type.Null()]),
});

export const NewsApiResultsSchema = Type.Array(NewsApiResultItemSchema);

export type NewsApiResultsSchemaType = Static<typeof NewsApiResultsSchema>;

export type NewsApiResultItemSchemaType = Static<
  typeof NewsApiResultItemSchema
>;

export const BrowsingOptionSchema = Type.Object({
  date_published: Type.String(),
  description: Type.String(),
  image: Type.Union([Type.String(), Type.Null()]),
  keywords: Type.Union([Type.Array(Type.String()), Type.Null()]),
  name: Type.String(),
  provider: Type.String(),
  url: Type.String(),
  logo: Type.Union([Type.String(), Type.Null()]),
});

export const BrowsingOptionsPageSchema = Type.Array(BrowsingOptionSchema);

export const PagesOfBrowsingOptionsSchema = Type.Array(
  BrowsingOptionsPageSchema,
);

export type PagesOfBrowsingOptionsSchemaType = Static<
  typeof PagesOfBrowsingOptionsSchema
>;

export type BrowsingOptionSchemaType = Static<typeof BrowsingOptionSchema>;
