import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { ExtractionJobSchema } from "../../lib/schemas/articles/ArticleSchema";
import type { ArticleSchemaType, ExtractionResult } from "../../lib/schemas/articles/ArticleSchema";
import { serverClient } from "../../lib/services/client/serverClient";
import reducer, { closeNotification, resetReadingSlice, incrementStoryBy } from "../../state/Reducers/Investigate/articles/ExtractedArticles";
import { extractionProgressReceived } from "../../state/Reducers/Investigate/articles/actions";
import { extractArticles } from "../../state/Reducers/Investigate/articles/thunks";
import { ExtractArticlesRouteHandler } from "../../lib/services/client/public/handlers/ExtractArticlesRouteHandler";
import { HttpClient } from "../../lib/services/client/http/httpClient";
import { RequestParser } from "../../lib/services/client/http/RequestParser";
import { ConfigRequestHandler } from "../../lib/services/client/http/ConfigRequestHandler";
import { serverClientRoutes } from "../../infra/transport/types/routeDefinitions";
import { ServerRequestError } from "../../lib/services/client/errors/ServerRequestError";
import { EXTRACTION_POLLING_POLICY, type ExtractionRequests } from "../../lib/services/client/public/handlers/PollExtractionHandler";

jest.mock("../../lib/services/client/serverClient", () => ({
  serverClient: { general: { extraction: { runExtractionJob: jest.fn() } } },
}));

const client: jest.Mocked<ExtractionRequests> = { extract: jest.fn(), poll: jest.fn() };
// Simulate a stalled fetch that rejects when its signal is aborted.
function pendingUntilAborted(signal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    signal.throwIfAborted();
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });
}
const article: ArticleSchemaType = {
  title: "An article", provider: "Source", article_url: "https://example.com/a",
  date_published: "2026-09-17", full_text: "Article content", id: 1,
  factual_reporting: "Unknown",
};
const failure = {
  title: "Failed article", article_url: "https://example.com/b", source: "Source",
  date: "2026-09-17", logo: "", summary: [{ denied: "Blocked", failedArticle: "https://example.com/b" }],
};
const selected = [{ url: article.article_url }] as SelectedArticle[];
const result: ExtractionResult = { progress: "2/2", retrieved: [article], rejected: [failure] };
const snapshot = (status: "pending" | "fulfilled" | "rejected", data = result) => ({
  status, result: data, error: null, createdAt: 1,
});
const makeStore = () => configureStore({
  reducer: { investigation: combineReducers({ read: reducer }) },
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  client.extract.mockReset().mockResolvedValue({ jobId: "job-1" });
  client.poll.mockReset();
  jest.spyOn(ExtractArticlesRouteHandler.prototype, "extract").mockImplementation(client.extract);
  jest.spyOn(ExtractArticlesRouteHandler.prototype, "poll").mockImplementation(client.poll);
  const handler = new ExtractArticlesRouteHandler(
    serverClientRoutes.public,
    new HttpClient(new RequestParser(), new ConfigRequestHandler()),
  );
  jest.mocked(serverClient.general.extraction.runExtractionJob)
    .mockImplementation((params) => handler.runExtractionJob(params));
});
afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

test("back-to-back starts and starts during progress cannot launch duplicate jobs", async () => {
  const store = makeStore();
  client.poll.mockResolvedValueOnce(snapshot("pending")).mockResolvedValueOnce(snapshot("fulfilled"));
  const first = store.dispatch(extractArticles(selected));
  const second = await store.dispatch(extractArticles(selected));
  expect(extractArticles.rejected.match(second) && second.meta.condition).toBe(true);
  expect(store.getState().investigation.read.activeRequestId).toBe(first.requestId);
  await jest.advanceTimersByTimeAsync(0);
  expect(store.getState().investigation.read.articles.status).toBe("partial");
  const third = await store.dispatch(extractArticles(selected));
  expect(extractArticles.rejected.match(third) && third.meta.condition).toBe(true);
  expect(client.extract).toHaveBeenCalledTimes(1);
  await jest.advanceTimersByTimeAsync(1000);
  await first;
  expect(store.getState().investigation.read.articles.status).toBe("ready");
});

test.each(["ready", "failed", "error", "aborted"])("a new extraction can start after %s", async (outcome) => {
  const store = makeStore();
  if (outcome === "ready") client.poll.mockResolvedValueOnce(snapshot("fulfilled"));
  if (outcome === "failed") client.poll.mockResolvedValueOnce(snapshot("fulfilled", { ...result, retrieved: [] }));
  if (outcome === "error") client.poll.mockRejectedValueOnce(new Error("Job failed"));
  if (outcome === "aborted") client.poll.mockResolvedValueOnce(snapshot("pending"));
  const first = store.dispatch(extractArticles(selected));
  if (outcome === "aborted") {
    await jest.advanceTimersByTimeAsync(0);
    first.abort();
  }
  await first;
  expect(store.getState().investigation.read.activeRequestId).toBeNull();
  client.poll.mockResolvedValueOnce(snapshot("fulfilled"));
  const next = await store.dispatch(extractArticles(selected));
  expect(extractArticles.fulfilled.match(next)).toBe(true);
  expect(client.extract).toHaveBeenCalledTimes(2);
  expect(store.getState().investigation.read.articles.status).toBe("ready");
});

test("polling moves pending → partial → ready, including mixed completion", async () => {
  const store = makeStore();
  client.poll
    .mockResolvedValueOnce(snapshot("pending", { progress: "0/2", retrieved: [], rejected: [] }))
    .mockResolvedValueOnce(snapshot("pending", { progress: "1/2", retrieved: [], rejected: [failure] }))
    .mockResolvedValueOnce(snapshot("fulfilled"));
  const task = store.dispatch(extractArticles(selected));
  expect(store.getState().investigation.read.articles.status).toBe("pending");
  await jest.advanceTimersByTimeAsync(0);
  expect(store.getState().investigation.read.articles.status).toBe("pending");
  await jest.advanceTimersByTimeAsync(1000);
  expect(store.getState().investigation.read.articles).toEqual({ status: "partial", data: { retrieved: [], failed: [failure] } });
  store.dispatch(closeNotification(failure.article_url));
  await jest.advanceTimersByTimeAsync(1000);
  await task;
  expect(store.getState().investigation.read.articles).toEqual({ status: "ready", data: { retrieved: [article], failed: [failure] } });
  expect(store.getState().investigation.read.dismissedFailureUrls).toEqual([failure.article_url]);
  expect(store.getState().investigation.read.progress).toBe("2/2");
  expect(client.poll).toHaveBeenCalledTimes(3);
});

test("all per-article failures complete as failed, not a rejected thunk", async () => {
  const store = makeStore();
  client.poll.mockResolvedValue(snapshot("fulfilled", { ...result, retrieved: [] }));
  const action = await store.dispatch(extractArticles(selected));
  expect(extractArticles.fulfilled.match(action)).toBe(true);
  expect(store.getState().investigation.read.articles).toMatchObject({ status: "failed", data: { retrieved: [], failed: [failure] } });
});

test("all-success completion is ready even without a progress callback", async () => {
  const store = makeStore();
  client.poll.mockResolvedValue(snapshot("fulfilled", { ...result, rejected: [] }));
  await store.dispatch(extractArticles(selected));
  expect(store.getState().investigation.read.articles).toEqual({ status: "ready", data: { retrieved: [article], failed: [] } });
});

test.each(["network", "job", "missing snapshot", "missing result"])("%s failure becomes a request error", async (kind) => {
  const store = makeStore();
  if (kind === "network") client.poll.mockRejectedValue(new Error("Network failed"));
  if (kind === "job") client.poll.mockResolvedValue({ ...snapshot("rejected"), error: "Job failed" });
  if (kind === "missing snapshot") client.poll.mockResolvedValue(undefined);
  if (kind === "missing result") client.poll.mockResolvedValue({ status: "fulfilled", createdAt: 1 });
  const action = await store.dispatch(extractArticles(selected));
  expect(extractArticles.rejected.match(action)).toBe(true);
  expect(store.getState().investigation.read.articles.status).toBe("error");
  expect(store.getState().investigation.read.articles).toMatchObject({ data: { retrieved: [], failed: [] } });
  expect(store.getState().investigation.read.activeRequestId).toBeNull();
});

test("aborting while waiting stops subsequent polls", async () => {
  const store = makeStore();
  client.poll.mockResolvedValue(snapshot("pending"));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(0);
  task.abort();
  await task;
  await jest.advanceTimersByTimeAsync(3000);
  expect(client.poll).toHaveBeenCalledTimes(1);
  expect(store.getState().investigation.read.articles).toEqual({
    status: "error", details: "Extraction canceled by user/navigation",
    data: { retrieved: result.retrieved, failed: result.rejected },
  });
  expect(jest.getTimerCount()).toBe(0);
});

test("late progress, success, and rejection cannot overwrite a newer attempt", () => {
  const store = makeStore();
  store.dispatch(extractArticles.pending("old", selected));
  store.dispatch(extractArticles.pending("new", selected));
  store.dispatch(extractionProgressReceived({ requestId: "old", result }));
  store.dispatch(extractArticles.fulfilled(result, "old", selected));
  store.dispatch(extractArticles.rejected(new Error("Old failure"), "old", selected));
  expect(store.getState().investigation.read.articles.status).toBe("pending");
  expect(store.getState().investigation.read.activeRequestId).toBe("new");
  store.dispatch(extractArticles.fulfilled(result, "new", selected));
  store.dispatch(extractionProgressReceived({ requestId: "new", result: { ...result, retrieved: [] } }));
  expect(store.getState().investigation.read.articles.status).toBe("ready");
});

test("repeated cumulative snapshots do not duplicate results or restore dismissed notices", () => {
  const store = makeStore();
  store.dispatch(extractArticles.pending("id", selected));
  store.dispatch(extractionProgressReceived({ requestId: "id", result }));
  store.dispatch(closeNotification(failure.article_url));
  store.dispatch(extractionProgressReceived({ requestId: "id", result }));
  expect(store.getState().investigation.read.articles).toMatchObject({ data: { retrieved: [article], failed: [failure] } });
  expect(store.getState().investigation.read.dismissedFailureUrls).toEqual([failure.article_url]);
  store.dispatch(resetReadingSlice());
  store.dispatch(extractionProgressReceived({ requestId: "id", result }));
  expect(store.getState().investigation.read.articles.status).toBe("initial");
  expect(store.getState().investigation.read.dismissedFailureUrls).toEqual([]);
});

test("empty selections do not start a job", async () => {
  const store = makeStore();
  await store.dispatch(extractArticles([]));
  expect(client.extract).not.toHaveBeenCalled();
  expect(store.getState().investigation.read.articles.status).toBe("initial");
});

test("the response schema accepts actual server snapshots and rejects malformed arrays", () => {
  const validator = TypeCompiler.Compile(ExtractionJobSchema);
  expect(validator.Check(snapshot("pending"))).toBe(true);
  expect(validator.Check(snapshot("fulfilled"))).toBe(true);
  expect(validator.Check({ ...snapshot("fulfilled"), result: { ...result, retrieved: article } })).toBe(false);
});

test("the HTTP client sends the server's extraction body and polls its job route", async () => {
  jest.restoreAllMocks();
  const fetchMock = jest.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response(JSON.stringify({ status: "success", message: "Extraction started", data: { jobId: "job-1" } }), { status: 202 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ status: "success", message: "Extraction progress", data: snapshot("pending") }), { status: 200 }));
  const handler = new ExtractArticlesRouteHandler(
    serverClientRoutes.public,
    new HttpClient(new RequestParser(), new ConfigRequestHandler()),
  );
  const signal = new AbortController().signal;
  const started = await handler.extract(selected, signal);
  expect(fetchMock).toHaveBeenNthCalledWith(1, "/articles/extract", expect.objectContaining({
    method: "POST", body: JSON.stringify({ articles: selected }), signal,
  }));
  const polled = await handler.poll({ jobId: started.jobId, signal });
  expect(fetchMock).toHaveBeenNthCalledWith(2, "/articles/extract/job-1", expect.objectContaining({ method: "GET", signal }));
  expect(polled).toEqual(snapshot("pending"));
});

test("the composed entry point starts, reports progress, and completes through HTTP", async () => {
  jest.restoreAllMocks();
  const response = (data: unknown, status = 200) => new Response(
    JSON.stringify({ status: "success", message: "OK", data }), { status },
  );
  const fetchMock = jest.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(response({ jobId: "job-1" }, 202))
    .mockResolvedValueOnce(response(snapshot("pending")))
    .mockResolvedValueOnce(response(snapshot("fulfilled")));
  const handler = new ExtractArticlesRouteHandler(
    serverClientRoutes.public,
    new HttpClient(new RequestParser(), new ConfigRequestHandler()),
  );
  const onProgress = jest.fn();
  const task = handler.runExtractionJob({ articles: selected, signal: new AbortController().signal, onProgress });
  await jest.advanceTimersByTimeAsync(1000);
  await expect(task).resolves.toEqual(result);
  expect(onProgress).toHaveBeenCalledWith(result);
  expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
    "/articles/extract", "/articles/extract/job-1", "/articles/extract/job-1",
  ]);
  expect(jest.getTimerCount()).toBe(0);
});

test("completion without any article outcomes is an error, not all-extractions-failed", async () => {
  const store = makeStore();
  client.poll.mockResolvedValue(snapshot("fulfilled", { progress: "0/0", retrieved: [], rejected: [] }));
  await store.dispatch(extractArticles(selected));
  expect(store.getState().investigation.read.articles.status).toBe("error");
});

test.each(["network", "job", "empty completion"])("%s interruption preserves received articles, failures, and reading position", async (kind) => {
  const store = makeStore();
  const secondArticle = { ...article, article_url: "https://example.com/c" };
  const partial = { ...result, progress: "3/4", retrieved: [article, secondArticle] };
  client.poll.mockResolvedValueOnce(snapshot("pending", partial));
  if (kind === "network") client.poll.mockRejectedValueOnce(new Error("Connection lost"));
  if (kind === "job") client.poll.mockResolvedValueOnce({ ...snapshot("rejected"), error: "Job interrupted" });
  if (kind === "empty completion") client.poll.mockResolvedValueOnce(snapshot("fulfilled", { progress: "0/0", retrieved: [], rejected: [] }));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(0);
  store.dispatch(incrementStoryBy(1));
  store.dispatch(closeNotification(failure.article_url));
  await jest.advanceTimersByTimeAsync(1000);
  await task;
  expect(store.getState().investigation.read.articles).toMatchObject({
    status: "error", data: { retrieved: [article, secondArticle], failed: [failure] },
  });
  expect(store.getState().investigation.read.currentStory).toBe(1);
  expect(store.getState().investigation.read.dismissedFailureUrls).toEqual([failure.article_url]);
  expect(store.getState().investigation.read.activeRequestId).toBeNull();
  store.dispatch(extractArticles.pending("retry", selected));
  expect(store.getState().investigation.read.articles).toEqual({ status: "pending" });
  expect(store.getState().investigation.read.currentStory).toBe(0);
  expect(store.getState().investigation.read.dismissedFailureUrls).toEqual([]);
});

test("an interruption preserves failure-only progress without claiming all extractions failed", async () => {
  const store = makeStore();
  client.poll
    .mockResolvedValueOnce(snapshot("pending", { ...result, retrieved: [] }))
    .mockRejectedValueOnce(new Error("Connection lost"));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(1000);
  await task;
  expect(store.getState().investigation.read.articles).toEqual({
    status: "error", details: "Connection lost", data: { retrieved: [], failed: [failure] },
  });
});

const temporaryNetworkError = () => new ServerRequestError("Connection lost", {
  kind: "network", method: "GET", url: "/articles/extract/job-1",
});

test("transient polling failures back off for 1, 2, and 4 seconds before recovering", async () => {
  const store = makeStore();
  client.poll.mockRejectedValueOnce(temporaryNetworkError())
    .mockRejectedValueOnce(temporaryNetworkError())
    .mockRejectedValueOnce(temporaryNetworkError())
    .mockResolvedValueOnce(snapshot("fulfilled"));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(0);
  expect(client.poll).toHaveBeenCalledTimes(1);
  for (const [index, delay] of [1000, 2000, 4000].entries()) {
    await jest.advanceTimersByTimeAsync(delay - 1);
    expect(client.poll).toHaveBeenCalledTimes(index + 1);
    await jest.advanceTimersByTimeAsync(1);
    expect(client.poll).toHaveBeenCalledTimes(index + 2);
  }
  await task;
  expect(store.getState().investigation.read.articles.status).toBe("ready");
  expect(client.extract).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
});

test("exhausted retries preserve the results already received", async () => {
  const store = makeStore();
  client.poll.mockResolvedValueOnce(snapshot("pending")).mockRejectedValue(temporaryNetworkError());
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(8000);
  await task;
  expect(client.poll).toHaveBeenCalledTimes(5);
  expect(store.getState().investigation.read.articles).toMatchObject({
    status: "error", details: expect.stringContaining("after 3 retries"),
    data: { retrieved: [article], failed: [failure] },
  });
  expect(jest.getTimerCount()).toBe(0);
});

test("a successful pending snapshot resets the consecutive retry budget", async () => {
  const store = makeStore();
  client.poll.mockRejectedValueOnce(temporaryNetworkError())
    .mockRejectedValueOnce(temporaryNetworkError())
    .mockRejectedValueOnce(temporaryNetworkError())
    .mockResolvedValueOnce(snapshot("pending"))
    .mockRejectedValueOnce(temporaryNetworkError())
    .mockResolvedValueOnce(snapshot("fulfilled"));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(9000);
  await task;
  expect(client.poll).toHaveBeenCalledTimes(6);
  expect(store.getState().investigation.read.articles.status).toBe("ready");
  expect(jest.getTimerCount()).toBe(0);
});

test.each([408, 429, 500, 502, 503, 504])("HTTP %s is retryable", async (status) => {
  const store = makeStore();
  client.poll.mockRejectedValueOnce(new ServerRequestError("Temporary failure", {
    kind: "http", status, method: "GET", url: "/articles/extract/job-1",
  })).mockResolvedValueOnce(snapshot("fulfilled"));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(1000);
  await task;
  expect(client.poll).toHaveBeenCalledTimes(2);
  expect(store.getState().investigation.read.articles.status).toBe("ready");
});

test.each([401, 403, 404])("HTTP %s stops immediately", async (status) => {
  const store = makeStore();
  client.poll.mockRejectedValue(new ServerRequestError("Permanent failure", {
    kind: "http", status, method: "GET", url: "/articles/extract/job-1",
  }));
  await store.dispatch(extractArticles(selected));
  expect(client.poll).toHaveBeenCalledTimes(1);
  expect(store.getState().investigation.read.articles.status).toBe("error");
  expect(jest.getTimerCount()).toBe(0);
});

test.each(["invalid-json", "invalid-response"] as const)("%s stops immediately", async (kind) => {
  const store = makeStore();
  client.poll.mockRejectedValue(new ServerRequestError("Malformed response", {
    kind, status: 200, method: "GET", url: "/articles/extract/job-1",
  }));
  await store.dispatch(extractArticles(selected));
  expect(client.poll).toHaveBeenCalledTimes(1);
  expect(store.getState().investigation.read.articles.status).toBe("error");
  expect(jest.getTimerCount()).toBe(0);
});

test("the overall deadline ends permanently pending jobs while retaining results", async () => {
  const store = makeStore();
  client.poll.mockResolvedValue(snapshot("pending"));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(EXTRACTION_POLLING_POLICY.deadlineMs);
  await task;
  expect(store.getState().investigation.read.articles).toMatchObject({
    status: "error", details: expect.stringContaining("5 minutes"),
    data: { retrieved: [article], failed: [failure] },
  });
  const count = client.poll.mock.calls.length;
  await jest.advanceTimersByTimeAsync(10000);
  expect(client.poll).toHaveBeenCalledTimes(count);
  expect(jest.getTimerCount()).toBe(0);
});

test("hanging poll requests are aborted and retries are bounded", async () => {
  const store = makeStore();
  client.poll.mockImplementation(({ signal }) => pendingUntilAborted(signal));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(67000);
  await task;
  expect(client.poll).toHaveBeenCalledTimes(4);
  expect(client.poll.mock.calls.every(([params]) => params.signal.aborted)).toBe(true);
  expect(store.getState().investigation.read.articles.status).toBe("error");
  expect(jest.getTimerCount()).toBe(0);
});

test("job creation times out without being retried", async () => {
  const store = makeStore();
  client.extract.mockImplementation((_, signal) => pendingUntilAborted(signal));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(15000);
  await task;
  expect(client.extract).toHaveBeenCalledTimes(1);
  expect(client.extract.mock.calls[0][1].aborted).toBe(true);
  expect(client.poll).not.toHaveBeenCalled();
  expect(store.getState().investigation.read.articles).toMatchObject({ status: "error", details: "Starting extraction timed out" });
  expect(jest.getTimerCount()).toBe(0);
});

test("cancellation interrupts retry backoff immediately", async () => {
  const store = makeStore();
  client.poll.mockRejectedValue(temporaryNetworkError());
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(0);
  task.abort();
  await task;
  await jest.advanceTimersByTimeAsync(10000);
  expect(client.poll).toHaveBeenCalledTimes(1);
  expect(store.getState().investigation.read.articles).toMatchObject({ status: "error", details: "Extraction canceled by user/navigation" });
  expect(jest.getTimerCount()).toBe(0);
});

test("the overall deadline aborts an in-flight poll before its request timeout", async () => {
  const store = makeStore();
  const start = Date.now();
  client.poll.mockImplementation(({ signal }) => Date.now() - start >= 299000
    ? pendingUntilAborted(signal)
    : Promise.resolve(snapshot("pending")));
  const task = store.dispatch(extractArticles(selected));
  await jest.advanceTimersByTimeAsync(300000);
  await task;
  const calls = client.poll.mock.calls;
  expect(calls[calls.length - 1][0].signal.aborted).toBe(true);
  expect(store.getState().investigation.read.articles).toMatchObject({
    status: "error", details: expect.stringContaining("5 minutes"),
    data: { retrieved: [article], failed: [failure] },
  });
  expect(jest.getTimerCount()).toBe(0);
});

test("network failure during job creation is not retried", async () => {
  const store = makeStore();
  client.extract.mockRejectedValue(temporaryNetworkError());
  await store.dispatch(extractArticles(selected));
  expect(client.extract).toHaveBeenCalledTimes(1);
  expect(client.poll).not.toHaveBeenCalled();
  expect(store.getState().investigation.read.articles.status).toBe("error");
  expect(jest.getTimerCount()).toBe(0);
});
