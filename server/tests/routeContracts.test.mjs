import test from "node:test";
import assert from "node:assert/strict";
import { Router } from "express";
import { publicRoutes } from "../dist/core/routes/config/publicRoutes.js";
import { protectedRoutes } from "../dist/core/routes/config/privateRoutes.js";

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
    extract: async term => { calls.push(term); return {}; },
  } } }, Router());
  await invoke(router, "get", "/wiki", { query: { q: "climate" } });
  await assert.rejects(invoke(router, "get", "/wiki", { query: { q: ["a", "b"] } }),
    error => error.statusCode === 400);
  assert.deepEqual(calls, ["climate"]);
});

test("private routes convert validated path IDs and retain the authenticated user", async () => {
  const calls = [];
  const record = async input => { calls.push(input); return { ok: true, data: {} }; };
  const router = protectedRoutes({ services: { api: {
    user: { articleById: record, removeBookmark: record, bookmark: record },
    investigations: { getInvestigation: record },
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
