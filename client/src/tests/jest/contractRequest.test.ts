import { Type } from "@sinclair/typebox";
import { PUBLIC_API_CONFIG, PRIVATE_API_CONFIG } from "@elenchus/contracts";
import { HttpClient } from "../../lib/services/client/http/httpClient";
import { RequestParser } from "../../lib/services/client/http/RequestParser";
import { ConfigRequestHandler } from "../../lib/services/client/http/ConfigRequestHandler";

const client = new HttpClient(new RequestParser(), new ConfigRequestHandler());
const originalFetch = globalThis.fetch;
const fetchMock = jest.fn();
beforeEach(() => { globalThis.fetch = fetchMock; fetchMock.mockReset(); });
afterEach(() => { globalThis.fetch = originalFetch; });

function respond(data: unknown) {
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ status: "success", message: "OK", data }), {
    status: 200, headers: { "Content-Type": "application/json" },
  }));
}

test("uses the contract method, JSON body and response schema", async () => {
  const output = { ok: true, data: "sent" };
  respond(output);
  const feedback = { email: "reader@example.com", message: "Hello" };
  await expect(client.request(PUBLIC_API_CONFIG.user.feedback, "/user/feedback", {
    body: { feedback },
  })).resolves.toEqual(output);
  expect(fetchMock).toHaveBeenCalledWith("/user/feedback", expect.objectContaining({
    method: "POST", credentials: "include", body: JSON.stringify({ feedback }),
    headers: { "Content-Type": "application/json" },
  }));
});

test("passes the handler-built URL to fetch unchanged", async () => {
  const route = {
    method: "GET", path: "/items/:id",
    paramsSchema: Type.Object({ id: Type.String() }),
    querySchema: Type.Object({ q: Type.String() }),
    outputSchema: Type.String(),
  } as const;
  respond("done");
  await client.request(route, "/items/a%2Fb?q=a%20%26%20b", {});
  expect(fetchMock.mock.calls[0][0]).toBe("/items/a%2Fb?q=a%20%26%20b");
  expect(fetchMock.mock.calls[0][1].body).toBeUndefined();
});

test("sends DELETE through the existing transport with its signal", async () => {
  respond({ ok: true, data: [] });
  const signal = new AbortController().signal;
  await client.request(PRIVATE_API_CONFIG.bookmarks.delete, "/user/bookmarks/42", {
    signal,
  });
  expect(fetchMock).toHaveBeenCalledWith("/user/bookmarks/42", {
    method: "DELETE", credentials: "include", signal,
  });
});

test("retains HTTP and network error categories", async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 503 }));
  await expect(client.request(PUBLIC_API_CONFIG.auth.logOut, "/auth/logOut", {})).rejects.toMatchObject({
    context: { kind: "http", status: 503 },
  });
  fetchMock.mockRejectedValue(new TypeError("offline"));
  await expect(client.request(PUBLIC_API_CONFIG.auth.logOut, "/auth/logOut", {})).rejects.toMatchObject({
    context: { kind: "network" },
  });
});

test("validates returned data and preserves cancellation", async () => {
  respond({ unexpected: true });
  await expect(client.request(PUBLIC_API_CONFIG.auth.logOut, "/auth/logOut", {})).rejects.toMatchObject({
    context: { kind: "invalid-response" },
  });
  const controller = new AbortController();
  const reason = new Error("cancelled");
  fetchMock.mockImplementation(async (_url, options) => {
    expect(options.signal).toBe(controller.signal);
    controller.abort(reason);
    throw reason;
  });
  await expect(client.request(PUBLIC_API_CONFIG.auth.logOut, "/auth/logOut", {
    signal: controller.signal,
  })).rejects.toBe(reason);
});

// Compile-time assertions: this function is deliberately never executed.
function checkRequestTypes() {
  // @ts-expect-error feedback requires a wrapper
  client.request(PUBLIC_API_CONFIG.user.feedback, "/user/feedback", { body: { email: "a", message: "b" } });
  // @ts-expect-error query construction belongs to the handler
  client.request(PUBLIC_API_CONFIG.integrations.newsApi, "/articles/search?q=climate", { query: { q: "climate" } });
  // @ts-expect-error logout has no body
  client.request(PUBLIC_API_CONFIG.auth.logOut, "/auth/logOut", { body: {} });
  const result: Promise<{ jobId: string }> = client.request(PUBLIC_API_CONFIG.articles.extract, "/articles/extract", {
    body: { articles: [] },
  });
  return result;
}
