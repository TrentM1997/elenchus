# Elenchus client

The client uses Astro with React, React Router, Redux Toolkit, and Tailwind CSS. Astro produces static output that Express serves in production.

Follow the root [setup instructions](../README.md) for installation, environment configuration, and Docker development.

## API access

`src/lib/services/client/serverClient.ts` constructs the shared client:

- `general` exposes public handlers.
- `privileged` exposes handlers for authenticated endpoints.
- Handlers select a shared contract entry and call `http.request(route, options)`.
- `RequestOptions` infers body, query, and path-parameter types from that entry.
- `RequestUrlBuilder` encodes raw path parameters and query values.
- `HttpClient` dispatches the HTTP method, includes credentials, and forwards cancellation.
- `RequestParser` validates the response envelope and its data, returning the validated data.

Pass raw query and parameter values to handlers; do not pre-encode them. Arrays are sent in JSON request bodies.

Import schemas directly from `@elenchus/contracts/schemas/...`. The old `src/lib/schemas` compatibility files have been removed.

See the [architecture guide](../docs/architecture.md) for an endpoint example and the server side of the request.

## Commands

From the repository root:

```sh
npm run build:contracts
npm run dev:client
npm run typecheck --workspace=elenchus
npm exec --workspace=elenchus -- jest --runInBand
npm run build:client
```

The development server uses port 5173. API proxy prefixes are configured in `astro.config.mjs`; add a prefix there when introducing a route outside the existing prefixes.

Jest maps contracts imports to TypeScript source. Astro and application builds resolve the compiled package exports.
