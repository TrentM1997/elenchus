# Elenchus client

The client uses Astro with React, React Router, Redux Toolkit, and Tailwind CSS. Astro produces static output in `client/dist`; the Express API runs separately and does not serve those files. React and Redux run in the browser.

Follow the root [setup instructions](../README.md) for installation, environment configuration, and Docker development.

## API access

`src/lib/services/client/serverClient.ts` constructs the shared client:

- `general` exposes public handlers.
- `privileged` exposes handlers for authenticated endpoints.
- Handlers select a shared contract entry and call `http.request(route, options)`.
- `RequestOptions` infers body, query, and path-parameter types from that entry.
- `RequestUrlBuilder` encodes raw path parameters and query values.
- It prepends `PUBLIC_API_ORIGIN` when configured; otherwise requests use the browser's current origin.
- `HttpClient` dispatches the HTTP method, includes credentials, and forwards cancellation.
- `RequestParser` validates the response envelope and its data, returning the validated data.

Pass raw query and parameter values to handlers; do not pre-encode them. Arrays are sent in JSON request bodies.

Import schemas directly from `@elenchus/contracts/schemas/...`. The old `src/lib/schemas` compatibility files have been removed.

See the [ServerClient guide](src/lib/services/client/README.md) for usage examples, result and error handling, cancellation, and extraction polling. The [architecture guide](../docs/architecture.md) covers adding an endpoint and the server side of the request.

## Commands

From the repository root:

```sh
npm run build:contracts
npm run dev:client
npm run typecheck --workspace=elenchus
npm exec --workspace=elenchus -- jest --runInBand
npm run build:client
```

The development server uses port 4173. API proxy prefixes are configured in `astro.config.mjs`; add a prefix there when introducing a route outside the existing prefixes. The proxy is used for requests to the client's origin during development. It targets `API_PROXY_TARGET` from the Astro process environment, defaulting to `http://localhost:5001`; Compose supplies `http://api:5001`.

Set `PUBLIC_API_ORIGIN` in `client/.env` to call a browser-reachable API origin directly, or leave it empty to use relative API paths. Built client files require either that configured API origin or a separately configured web-server proxy; the development proxy does not ship with static output. See [client environment configuration](../README.md#client-configuration-and-api-urls), including the public Supabase values used by the password-update page.

Jest maps contracts imports to TypeScript source. Its `ts-jest` transformer replaces `import.meta.env` with test values, including `PUBLIC_API_ORIGIN: ""`. Astro and application builds resolve the compiled package exports, so build contracts before building the client.
