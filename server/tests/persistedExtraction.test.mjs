import test from "node:test";
import assert from "node:assert/strict";
import { persistedArticle, articleToExtract } from "../dist/tests/mocks/mockValues.js";
import { createExtractionSetup, createArticleRepositoryMock, deferred, flush } from "../dist/tests/mocks/mockers.js";

test("cached articles use a normalized batch lookup and bypass scraping and saving", async (t) => {
  const { service, byUrls, save, scrape, getBiases } = createExtractionSetup(t, {
    byUrls: async () => ({ ok: true, data: [persistedArticle] }),
  });
  const requested = {
    ...articleToExtract,
    url: `${articleToExtract.url}?utm_source=newsletter#section`,
  };

  const { jobId } = await service.extract([requested]);
  const job = service.getExtractionJob(jobId);

  assert.equal(byUrls.mock.callCount(), 1);
  assert.deepEqual(byUrls.mock.calls[0].arguments, [[articleToExtract.url]]);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result, {
    progress: "1/1",
    retrieved: [persistedArticle],
    rejected: [],
  });
  assert.equal(scrape.mock.callCount(), 0);
  assert.equal(save.mock.callCount(), 0);
  assert.equal(getBiases.mock.callCount(), 0);
  assert.equal(
    requested.url,
    `${articleToExtract.url}?utm_source=newsletter#section`,
  );
});

test("mixed cached and missing articles only scrape misses and count both in progress", async (t) => {
  const missing = {
    ...articleToExtract,
    url: "https://example.com/new?utm_source=search#body",
  };
  const cleanMissing = { ...missing, url: "https://example.com/new" };
  const persistence = deferred();
  const { service, byUrls, save, scrape, getBiases } = createExtractionSetup(t, {
    byUrls: async () => ({ ok: true, data: [persistedArticle] }),
    save: () => persistence.promise,
  });

  const { jobId } = await service.extract([articleToExtract, missing]);
  await flush();
  assert.deepEqual(byUrls.mock.calls[0].arguments, [
    [articleToExtract.url, cleanMissing.url],
  ]);
  assert.equal(byUrls.mock.callCount(), 1);
  assert.deepEqual(getBiases.mock.calls[0].arguments, [[cleanMissing]]);
  assert.equal(scrape.mock.callCount(), 1);
  assert.equal(scrape.mock.calls[0].arguments[0], cleanMissing.url);
  assert.equal(save.mock.callCount(), 1);
  const saved = { ...save.mock.calls[0].arguments[0], id: 202 };
  assert.equal(saved.article_url, cleanMissing.url);
  assert.equal(service.getExtractionJob(jobId).status, "pending");
  assert.deepEqual(service.getExtractionJob(jobId).result, {
    progress: "1/2",
    retrieved: [persistedArticle],
    rejected: [],
  });

  persistence.resolve({ ok: true, data: saved });
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result, {
    progress: "2/2",
    retrieved: [persistedArticle, saved],
    rejected: [],
  });
});

for (const failure of ["returned", "thrown"]) {
  test(`${failure} lookup failures stop extraction before any scrape or save`, async (t) => {
    const lookupError = new Error("Database unavailable");
    const byUrls = async () => {
      if (failure === "thrown") throw lookupError;
      return {
        ok: false,
        message: lookupError.message,
        details: "lookup failed",
      };
    };
    const { service, save, scrape, getBiases } = createExtractionSetup(t, { byUrls });

    await assert.rejects(service.extract([articleToExtract]), (error) => {
      if (failure === "thrown") return error === lookupError;
      return (
        error.statusCode === 500 &&
        error.message === lookupError.message &&
        error.details === "lookup failed"
      );
    });
    assert.equal(scrape.mock.callCount(), 0);
    assert.equal(save.mock.callCount(), 0);
    assert.equal(getBiases.mock.callCount(), 0);
  });
}

test("snapshots wait for persistence and publish the returned database row", async (t) => {
  const persistence = deferred();
  const { service, save } = createExtractionSetup(t, { save: () => persistence.promise });
  const { jobId } = await service.extract([articleToExtract]);
  await flush();
  const input = save.mock.calls[0].arguments[0];
  assert.equal(Object.hasOwn(input, "id"), false);
  assert.equal(service.getExtractionJob(jobId).status, "pending");
  assert.deepEqual(service.getExtractionJob(jobId).result.retrieved, []);
  const saved = { ...input, id: 1948, title: "Database returned title" };
  persistence.resolve({ ok: true, data: saved });
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(job.result.retrieved, [saved]);
  assert.equal(job.result.progress, "1/1");
  assert.equal(save.mock.callCount(), 1);
});

test("a failed save is reported without publishing the unsaved article", async (t) => {
  const { service } = createExtractionSetup(t, {
    save: async () => ({ ok: false, message: "Database unavailable" }),
  });
  const { jobId } = await service.extract([articleToExtract]);
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled"); // Completed attempt; per-article failure.
  assert.deepEqual(job.result.retrieved, []);
  assert.equal(
    job.result.rejected[0].summary[0].denied,
    "article persistence failed",
  );
});

test("mixed results retain saved articles and reject rows without a database ID", async (t) => {
  const { repository } = createArticleRepositoryMock(t, [42, null]);
  const { service } = createExtractionSetup(t, {
    save: (article) => repository.write.article(article),
  });
  const { jobId } = await service.extract([
    articleToExtract,
    { ...articleToExtract, url: "https://example.com/other" },
  ]);
  await flush();
  const job = service.getExtractionJob(jobId);
  assert.equal(job.status, "fulfilled");
  assert.deepEqual(
    job.result.retrieved.map((article) => article.id),
    [42],
  );
  assert.equal(job.result.rejected.length, 1);
  assert.equal(job.result.progress, "2/2");
});
