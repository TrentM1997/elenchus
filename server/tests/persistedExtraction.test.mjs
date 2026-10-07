import test from "node:test";
import assert from "node:assert/strict";
import { ArticleService } from "../dist/services/articles/articleService.js";
import { FirecrawlService } from "../dist/services/firecrawl/firecrawlService.js";
import { ArticlesRepository } from "../dist/db/access/repositories/articles/articlesRepository.js";

const selected = {
  url: "https://example.com/article", title: "Article", source: "Source",
  date: "2026-09-20", logo: "", image: "",
};
const flush = () => new Promise(resolve => setImmediate(resolve));

const cachedArticle = {
  id: 101, article_url: selected.url, title: "Saved article", provider: "Source",
  authors: [], image_url: "", date_published: selected.date, fallbackDate: selected.date,
  summary: null, full_text: "Previously saved content", logo: "",
  bias: "Unknown", factual_reporting: "Unknown", country: null,
};

function setup(saveArticle, {
  byUrls = async () => ({ ok: true, data: [] }),
  scrape = async () => ({ json: { content_markdown: "Article text. ".repeat(30) } }),
  getBiases = async () => new Map(),
} = {}) {
  const sdk = { scrape };
  return new ArticleService({
    sources: { getBiases },
    articles: { saveArticle, byUrls },
  }, new FirecrawlService(sdk));
}

test("cached articles use a normalized batch lookup and bypass scraping and saving", async t => {
  const byUrls = t.mock.fn(async () => ({ ok: true, data: [cachedArticle] }));
  const save = t.mock.fn();
  const scrape = t.mock.fn();
  const getBiases = t.mock.fn();
  const service = setup(save, { byUrls, scrape, getBiases });
  const requested = { ...selected, url: `${selected.url}?utm_source=newsletter#section` };

  const { jobId } = await service.extract([requested]);
  const job = service.getExtractionJob(jobId);

  assert.equal(byUrls.mock.callCount(), 1);
  assert.deepEqual(byUrls.mock.calls[0].arguments, [[selected.url]]);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result, { progress: "1/1", retrieved: [cachedArticle], rejected: [] });
  assert.equal(scrape.mock.callCount(), 0);
  assert.equal(save.mock.callCount(), 0);
  assert.equal(getBiases.mock.callCount(), 0);
  assert.equal(requested.url, `${selected.url}?utm_source=newsletter#section`);
});

test("mixed cached and missing articles only scrape misses and count both in progress", async t => {
  const missing = { ...selected, url: "https://example.com/new?utm_source=search#body" };
  const cleanMissing = { ...missing, url: "https://example.com/new" };
  const byUrls = t.mock.fn(async () => ({ ok: true, data: [cachedArticle] }));
  const scrape = t.mock.fn(async () => ({ json: { content_markdown: "Article text. ".repeat(30) } }));
  const getBiases = t.mock.fn(async () => new Map());
  let resolveSave;
  let saved;
  const save = t.mock.fn(article => {
    saved = { ...article, id: 202 };
    return new Promise(resolve => { resolveSave = resolve; });
  });
  const service = setup(save, { byUrls, scrape, getBiases });

  const { jobId } = await service.extract([selected, missing]);
  await flush();
  assert.deepEqual(byUrls.mock.calls[0].arguments, [[selected.url, cleanMissing.url]]);
  assert.equal(byUrls.mock.callCount(), 1);
  assert.deepEqual(getBiases.mock.calls[0].arguments, [[cleanMissing]]);
  assert.equal(scrape.mock.callCount(), 1);
  assert.equal(scrape.mock.calls[0].arguments[0], cleanMissing.url);
  assert.equal(save.mock.callCount(), 1);
  assert.equal(saved.article_url, cleanMissing.url);
  assert.equal(service.getExtractionJob(jobId).status, "pending");
  assert.deepEqual(service.getExtractionJob(jobId).result, {
    progress: "1/2", retrieved: [cachedArticle], rejected: [],
  });

  resolveSave({ ok: true, data: saved });
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result, {
    progress: "2/2", retrieved: [cachedArticle, saved], rejected: [],
  });
});

for (const failure of ["returned", "thrown"]) {
  test(`${failure} lookup failures stop extraction before any scrape or save`, async t => {
    const lookupError = new Error("Database unavailable");
    const byUrls = async () => {
      if (failure === "thrown") throw lookupError;
      return { ok: false, message: lookupError.message, details: "lookup failed" };
    };
    const save = t.mock.fn();
    const scrape = t.mock.fn();
    const getBiases = t.mock.fn();
    const service = setup(save, { byUrls, scrape, getBiases });

    await assert.rejects(service.extract([selected]), error => {
      if (failure === "thrown") return error === lookupError;
      return error.statusCode === 500 && error.message === lookupError.message
        && error.details === "lookup failed";
    });
    assert.equal(scrape.mock.callCount(), 0);
    assert.equal(save.mock.callCount(), 0);
    assert.equal(getBiases.mock.callCount(), 0);
  });
}

test("snapshots wait for persistence and publish the returned database row", async () => {
  let resolveSave;
  let input;
  let saves = 0;
  const service = setup(article => {
    input = article;
    saves++;
    return new Promise(resolve => { resolveSave = resolve; });
  });
  const { jobId } = await service.extract([selected]);
  await flush();
  assert.equal(Object.hasOwn(input, "id"), false);
  assert.equal(service.getExtractionJob(jobId).status, "pending");
  assert.deepEqual(service.getExtractionJob(jobId).result.retrieved, []);
  const saved = { ...input, id: 1948, title: "Database returned title" };
  resolveSave({ ok: true, data: saved });
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result.retrieved, [saved]);
  assert.equal(job.result.progress, "1/1");
  assert.equal(saves, 1);
});

test("a failed save is reported without publishing the unsaved article", async () => {
  const service = setup(async () => ({ ok: false, message: "Database unavailable" }));
  const { jobId } = await service.extract([selected]);
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled"); // Completed attempt; per-article failure.
  assert.deepEqual(job.result.retrieved, []);
  assert.equal(job.result.rejected[0].summary[0].denied, "article persistence failed");
});

test("mixed results retain saved articles and reject rows without a database ID", async () => {
  let count = 0;
  // Mock the database response, preserving the repository's real row validation.
  const repository = new ArticlesRepository({
    from(table) {
      assert.equal(table, "articles");
      return {
        insert([article]) {
          const id = count++ === 0 ? 42 : null;
          return { select: () => ({ single: async () => ({ data: { ...article, id }, error: null }) }) };
        },
      };
    },
  });
  const service = setup(article => repository.saveArticle(article));
  const { jobId } = await service.extract([selected, { ...selected, url: "https://example.com/other" }]);
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result.retrieved.map(article => article.id), [42]);
  assert.equal(job.result.rejected.length, 1);
  assert.equal(job.result.progress, "2/2");
});
