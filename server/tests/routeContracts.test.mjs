import test from "node:test";
import assert from "node:assert/strict";
import { Router } from "express";
import { publicRoutes } from "../dist/core/routes/config/publicRoutes.js";
import { protectedRoutes } from "../dist/core/routes/config/privateRoutes.js";
import { PUBLIC_API_CONFIG, PRIVATE_API_CONFIG } from "@elenchus/contracts";

function invoke(router, method, path, request) {
  const route = router.stack.find(layer =>
    layer.route?.path === path && layer.route.methods[method]);
  assert.ok(route, `${method} ${path} is registered`);
  return new Promise((resolve, reject) => {
    route.route.stack[0].handle(request, {
      success: (message, data, status) => resolve({ data, status }),
      setHeader() {},
    }, reject);
  });
}

test("feedback validates the complete body and passes the inner feedback to the service", async () => {
  const feedback = { email: "reader@example.com", message: "Hello" };
  const calls = [];
  const router = publicRoutes({ services: { api: { user: {
    submitFeedback: async input => { calls.push(input); return { ok: true, data: "sent" }; },
  } } } }, Router());
  await invoke(router, "post", "/user/feedback", { body: { feedback } });
  await assert.rejects(invoke(router, "post", "/user/feedback", { body: feedback }),
    error => error.statusCode === 400);
  assert.deepEqual(calls, [feedback]);
});

test("search validates the query object and passes only q to the integration", async () => {
  const calls = [];
  const router = publicRoutes({ integrations: { wiki: {
    extract: async term => { calls.push(term); return { kind: "error", message: "Not found" }; },
  } } }, Router());
  await invoke(router, "get", "/wiki", { query: { q: "climate" } });
  await assert.rejects(invoke(router, "get", "/wiki", { query: { q: ["a", "b"] } }),
    error => error.statusCode === 400);
  assert.deepEqual(calls, ["climate"]);
});

for (const [name, config, register] of [
  ["public", PUBLIC_API_CONFIG, publicRoutes],
  ["private", PRIVATE_API_CONFIG, protectedRoutes],
]) {
test(`each ${name} contract is registered once with its declared method`, () => {
  const router = register({}, Router());
  function routes(config) {
    return Object.values(config).flatMap(value =>
      "path" in value ? [value] : routes(value));
  }
  const expected = routes(config)
    .map(route => `${route.method} ${route.path}`).sort();
  const actual = router.stack.flatMap(layer => layer.route
    ? Object.keys(layer.route.methods).map(method => `${method.toUpperCase()} ${layer.route.path}`)
    : []).sort();
  assert.deepEqual(actual, expected);
});
}

test("invalid success payloads become server errors", async () => {
  const router = publicRoutes({ services: { api: { user: {
    submitFeedback: async () => ({ ok: true, data: 123 }),
  } } } }, Router());
  await assert.rejects(invoke(router, "post", "/user/feedback", {
    body: { feedback: { email: "reader@example.com", message: "Hello" } },
  }), error => error.statusCode === 500);
});

test("extraction validates responses while retaining 202, polling snapshots, and 404", async () => {
  const job = {
    status: "pending", result: { progress: "0/1", retrieved: [], rejected: [] },
    error: null, createdAt: 1,
  };
  const router = publicRoutes({ services: { api: { articles: {
    extract: () => ({ jobId: "job-1" }),
    getExtractionJob: id => id === "job-1" ? job : undefined,
  } } } }, Router());
  assert.deepEqual(await invoke(router, "post", "/articles/extract", {
    body: { articles: [] },
  }), { data: { jobId: "job-1" }, status: 202 });
  assert.deepEqual(await invoke(router, "get", "/articles/extract/:jobId", {
    params: { jobId: "job-1" },
  }), { data: job, status: 200 });
  await assert.rejects(invoke(router, "get", "/articles/extract/:jobId", {
    params: { jobId: "missing" },
  }), error => error.statusCode === 404);
});

test("private routes convert validated path IDs and retain the authenticated user", async () => {
  const calls = [];
  const article = {
    id: 42, title: "Article", provider: "Source", article_url: "https://example.com",
    date_published: "2026-09-24", full_text: "Text", factual_reporting: "Unknown",
  };
  const bookmark = {
    id: "bookmark-1", article_id: 42, user_id: "authenticated-user",
    created_at: "2026-09-24", updated_at: null,
  };
  const investigation = {
    id: 73, created_at: "2026-09-24", idea: "Topic",
    initial_perspective: null, ending_perspective: null, expertise: null,
  };
  const record = data => async input => { calls.push(input); return { ok: true, data }; };
  const router = protectedRoutes({ services: { api: {
    user: { articleById: record(article), removeBookmark: record([bookmark]), bookmark: record(bookmark) },
    investigations: { getInvestigation: record(investigation) },
  } } }, Router());
  const user = { userId: "authenticated-user" };
  for (const method of ["get", "delete"]) {
    await invoke(router, method, "/user/bookmarks/:articleId", {
      user, params: { articleId: "42" },
    });
    await assert.rejects(invoke(router, method, "/user/bookmarks/:articleId", {
      user, params: { articleId: "invalid" },
    }), error => error.statusCode === 400);
  }
  await invoke(router, "post", "/user/bookmarks", { user, body: { article_id: 42 } });
  await invoke(router, "get", "/user/investigations/:investigationId", {
    user, params: { investigationId: "73" },
  });
  assert.deepEqual(calls, [
    ...Array.from({ length: 3 }, () => ({ user_id: user.userId, article_id: 42 })),
    { user_id: user.userId, investigation_id: 73 },
  ]);
});

test("private routes reject malformed service results before sending success", async () => {
  const router = protectedRoutes({ services: { api: { user: {
    articlesBookmarked: async () => ({ ok: true, data: {} }),
  } } } }, Router());
  await assert.rejects(invoke(router, "get", "/user/bookmarks", {
    user: { userId: "authenticated-user" },
  }), error => error.statusCode === 500);
});
