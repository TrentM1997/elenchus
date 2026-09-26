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

function setup(saveArticle) {
  const sdk = { scrape: async () => ({ json: { content_markdown: "Article text. ".repeat(30) } }) };
  return new ArticleService({
    sources: { getBiases: async () => new Map() },
    articles: { saveArticle },
  }, new FirecrawlService(sdk));
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
  const { jobId } = service.extract([selected]);
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
  const { jobId } = service.extract([selected]);
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
  const { jobId } = service.extract([selected, { ...selected, url: "https://example.com/other" }]);
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result.retrieved.map(article => article.id), [42]);
  assert.equal(job.result.rejected.length, 1);
  assert.equal(job.result.progress, "2/2");
});
