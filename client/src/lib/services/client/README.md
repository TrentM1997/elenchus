# ServerClient

`serverClient` is the browser application's entry point for calling the Express API. Use it from thunks and hooks so requests share the same route contracts, URL construction, credentials, and response validation.

It does not access Supabase directly. Database RPCs and persistence belong to the server. Redux state, toasts, navigation, and component rendering belong to callers.

## Public API

Import the configured singleton:

```ts
import { serverClient } from "@/lib/services/client/serverClient";
```

| Branch | Responsibility |
| --- | --- |
| `general.auth` | Login, logout, and session-related requests |
| `general.user` | Public user operations such as feedback |
| `general.integrations` | News, Wikipedia, and Bluesky requests |
| `general.extraction` | Start an extraction job and poll its progress |
| `privileged.user.select` | Read saved investigations and bookmarks/articles |
| `privileged.user.write` | Save investigations and manage bookmarks |
| `privileged.account` | Protected account operations |

`privileged` describes the server route group; it does not grant authorization. The server authenticates and authorizes requests. Requests include cookies through `credentials: "include"`.

## Request flow

```text
Thunk or hook
  → ServerClient domain handler
  → HttpClient.request(shared contract, options)
  → RequestUrlBuilder + ConfigRequestHandler
  → fetch
  → HTTP status check
  → RequestParser: validate envelope, then endpoint payload
  → typed result returned to caller
```

`serverClient.ts` constructs the dependencies. `ServerClient` also accepts injected contracts and an `IHttpClient`, allowing tests to replace transport without making real requests.

Contracts live in `packages/contracts/src/contract/apiContracts.ts`, with grouping in `apiContractConfig.ts` and schemas under `packages/contracts/src/schemas`. They define the HTTP method, path, input schemas, and output schema used by both client and server.

`RequestOptions<R>` derives `body`, `query`, and `params` requirements from the selected contract. These are compile-time checks; the server performs runtime input validation. The client performs runtime response validation.

Pass raw query values and path parameters. `RequestUrlBuilder` encodes them; pre-encoding would encode them twice. The current transport supports GET, POST, and DELETE, with no general-purpose retry or timeout policy.

## Results and errors

The parser removes the outer HTTP success envelope and returns its validated `data`. An endpoint payload can itself be a result union:

```ts
{ ok: true, data: payload }
// or
{ ok: false, message, details }
```

For investigation saving and hydration, the successful payload is `{ investigation, sources, extracts }`. Other endpoints have their own shapes; do not assume every method returns an `ok` union.

There are two failure paths callers must handle:

1. A successful HTTP response containing a contract-valid `{ ok: false }` resolves normally. Check `result.ok` before using `result.data`.
2. Network failures, non-success HTTP statuses, invalid JSON, and invalid response schemas reject the promise.

`ServerRequestError.context.kind` distinguishes `network`, `http`, `invalid-json`, and `invalid-response`. Context includes the method and URL, plus status where available. Abort reasons are preserved rather than wrapped as network failures.

**Current limitation:** non-success HTTP response bodies are not parsed. The HTTP error reports method, URL, and status; it does not expose the server response's message or details. Do not assume `context.details` is populated for HTTP errors.

## Example: hydrate an investigation

This can be called inside an async thunk with `thunkAPI.signal`:

```ts
async function loadInvestigation(id: number, signal: AbortSignal) {
  const result = await serverClient.privileged.user.select.investigations.byId(
    id,
    signal,
  );

  if (result.ok === false) {
    throw new Error(result.message);
  }

  return result.data; // { investigation, sources, extracts }
}
```

The caller handles rejected promises and decides how to present failures. In Redux, convert errors to serializable strings or plain objects before storing them.

## Example: save an investigation

```ts
import type { PersistInvestigationInputSchemaType } from
  "@elenchus/contracts/schemas/investigations/InvestigationSchema";

async function saveInvestigation(
  investigation: PersistInvestigationInputSchemaType,
  articleIds: number[],
) {
  const result = await serverClient.privileged.user.write.investigation({
    investigation,
    articleIds,
    extracts: [], // Supply the selected Wikipedia extracts when present.
  });

  if (result.ok === false) {
    throw new Error(result.message);
  }

  return result.data;
}
```

The server owns the atomic save RPC. Avoid automatically retrying writes: a response can be lost after the database committed, and another call can create another record.

## Cancellation and extraction polling

Transport accepts an optional `AbortSignal`, but a domain method must explicitly accept and forward it. Investigation and article `byId` methods do; not every public method currently exposes cancellation.

For a new cancellable method, carry the same signal through the public interface, handler, and `http.request(route, { ..., signal })`. Aborting a Redux thunk only aborts the underlying fetch when that signal reaches transport. Callers also need to protect their state against outdated responses.

Extraction is a higher-level workflow:

```ts
await serverClient.general.extraction.runExtractionJob({
  articles,
  signal,
  onProgress: (snapshot) => {
    // Consume cumulative retrieved/rejected results without duplicating them.
  },
});
```

`articles` is the selected-article input accepted by `PollExtractionParams`. The workflow returns an `ExtractionResult`. Its polling handler owns the overall deadline, request timeouts, and bounded retries for eligible polling failures. Starting the job is never retried. See `EXTRACTION_POLLING_POLICY` in `public/handlers/PollExtractionHandler.ts` for current values. Cancelling client polling does not cancel the server's extraction job.

## Adding or changing an endpoint

1. Define or update its shared input/output schemas and route contract. Add it to the contract grouping if needed.
2. Register the server route using that contract, including runtime input and output validation.
3. Add the domain handler method and its public interface. Delegate to `http.request` with the contract instead of duplicating URLs or fetch logic.
4. Forward `signal` throughout the call chain if cancellation is supported.
5. Update callers, state types, and fixtures when the response shape changes.
6. Cover request method/body/encoding, response validation, failure behavior, and cancellation where relevant.

Useful tests are `client/src/tests/jest/contractRequest.test.ts`, `extractionWorkflow.test.ts`, `investigationHydration.test.ts`, `dashboardDetailCancellation.test.ts`, and `server/tests/routeContracts.test.mjs`. Route mocks do not verify database RPC behavior; SQL needs separate database-level verification.

From the repository root:

```sh
npm run typecheck
npm exec --workspace=elenchus -- jest --runInBand
npm test --workspace=server
```
