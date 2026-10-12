import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { ArticleToExtractSchemaType } from "@elenchus/contracts/schemas/articles/FirecrawlExtractionSchemas";

export const scrapeResponse = {
  json: { content_markdown: "Article text. ".repeat(30) },
};

export const articleToExtract = {
  url: "https://example.com/article",
  title: "Article",
  source: "Source",
  date: "2026-09-20",
  logo: "",
  image: "https://exampleimage.com/article/thumbnail",
} satisfies ArticleToExtractSchemaType;

export const persistedArticle = {
  id: 101,
  article_url: articleToExtract.url,
  title: "Saved article",
  provider: "Source",
  authors: [],
  image_url: "",
  date_published: articleToExtract.date,
  fallbackDate: articleToExtract.date,
  summary: null,
  full_text: "Previously saved content",
  logo: "",
  bias: "Unknown",
  factual_reporting: "Unknown",
  country: null,
} satisfies ArticleSchemaType;
