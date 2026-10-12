

import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import type Firecrawl from "@mendable/firecrawl-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/databaseInterfaces.js";
import type { IDbClient } from "../../db/access/client/dbClient.js";
import type { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import type { DbResult } from "../../db/types/types.js";
import { ArticleService } from "../../services/articles/articleService.js";
import { FirecrawlService } from "../../services/firecrawl/firecrawlService.js";
import { ArticlesRepository } from "../../db/access/repositories/articles/articlesRepository.js";
import { scrapeResponse } from "./mockValues.js";

type ExtractionDb = Pick<IDbClient, "articles" | "sources">;
type Lookup = ExtractionDb["articles"]["select"]["byUrls"];
type Save = ExtractionDb["articles"]["write"]["article"];
type Overrides = { byUrls?: Lookup; save?: Save };

export function createDbMock(t: TestContext, overrides: Overrides = {}) {
  return {
    articles: {
      select: {
        byId: t.mock.fn<ExtractionDb["articles"]["select"]["byId"]>(async () => {
          throw new Error("Unexpected article lookup by ID");
        }),
        byIds: t.mock.fn<ExtractionDb["articles"]["select"]["byIds"]>(async () => {
          throw new Error("Unexpected article lookup by IDs");
        }),
        byUrls: t.mock.fn<Lookup>(overrides.byUrls ?? (async () => ({ ok: true, data: [] }))),
      },
      write: {
        article: t.mock.fn<Save>(overrides.save ?? (async () => {
          throw new Error("Configure the save result for this test");
        })),
      },
    },
    sources: {
      getBiases: t.mock.fn<ExtractionDb["sources"]["getBiases"]>(async () => new Map()),
    },
  } satisfies ExtractionDb;
}

export function createExtractionSetup(t: TestContext, overrides: Overrides = {}) {
  const db = createDbMock(t, overrides);
  const scrape = t.mock.fn(async (_url: string) => structuredClone(scrapeResponse));
  // FirecrawlService uses only scrape; the rest of the external SDK is intentionally absent.
  const sdk = { scrape } as unknown as Firecrawl;
  const service = new ArticleService(db, new FirecrawlService(sdk));
  return {
    service, db, scrape,
    byUrls: db.articles.select.byUrls,
    save: db.articles.write.article,
    getBiases: db.sources.getBiases,
  };
}

export function deferred<T = DbResult<ArticleSchemaType>>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((complete) => { resolve = complete; });
  return { promise, resolve };
}

export const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

export function createArticleRepositoryMock(t: TestContext, ids: (number | null)[]) {
  let index = 0;
  const insert = t.mock.fn((articles: unknown[]) => {
    assert.ok(index < ids.length, "Unexpected article insert");
    const article = articles[0];
    assert.ok(typeof article === "object" && article !== null);
    const data = { ...article, id: ids[index++] };
    return { select: () => ({ single: async () => ({ data, error: null }) }) };
  });
  const db = {
    from(table: string) {
      assert.equal(table, "articles");
      return { insert };
    },
  };
  // Keep real repository validation while replacing only the Supabase insert chain.
  const repository = new ArticlesRepository(db as unknown as SupabaseClient<Database>);
  return { repository, insert };
}
