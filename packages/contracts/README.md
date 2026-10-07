# Elenchus contracts

`@elenchus/contracts` is the private ESM workspace shared by the client and server. It owns HTTP paths, methods, request schemas, response-data schemas, and their inferred TypeScript types.

## Layout

- `src/contract/apiContracts.ts`: endpoint entries grouped by feature.
- `src/contract/apiContractConfig.ts`: public/private configuration and combined `apiContractConfig`.
- `src/contract/types.ts`: contract structure definitions.
- `src/schemas/`: reusable TypeBox schemas, inferred types, and validators.
- `src/index.ts`: public configuration/type exports and schema namespaces.

Each entry declares `path`, `method`, and `outputSchema`, plus `bodySchema`, `querySchema`, or `paramsSchema` when applicable. The output schema describes the success envelope's **data**, not the entire HTTP response. Status codes and error handling remain in server handlers.

## Imports

```ts
import { PUBLIC_API_CONFIG, type PublicApiContract } from "@elenchus/contracts";
import {
  ArticleSchema,
  type ArticleSchemaType,
} from "@elenchus/contracts/schemas/articles/ArticleSchema";
```

Schema modules are also exported as namespaces from the package root. Use these exports rather than importing another workspace's source files.

The root `workspaces` configuration includes `packages/contracts`, `client`, and `server`. npm links the contracts package by its `package.json` name, `@elenchus/contracts`, and both applications declare it as a dependency. Its `exports` field maps the imports above to compiled files in `dist/`.

This package is a code dependency, not a running service or Docker container. Both applications need it at build time. The browser build bundles the runtime schemas it uses; the Express runtime must still be able to resolve the compiled package. TypeScript-only types are erased during compilation.

The old client and server compatibility re-export files have been removed. Active server-specific schemas and validators remain in `server/schemas`, including article insertion (which omits the database-generated ID), authenticated-ID validation, and upstream response validation.

## Build

From the repository root:

```sh
npm run build:contracts
npm run typecheck --workspace=@elenchus/contracts
npm run build --workspace=@elenchus/contracts -- --watch
```

The compiler emits JavaScript and declarations into `dist/`. Package exports resolve there, so rebuild after changes. Relative imports inside this ESM package use `.js` extensions for Node-compatible emitted imports.

Root `build:client` and `build:server` do not rebuild contracts automatically; run `build:contracts` first. Root `typecheck`, `dev:server:nodemon`, and the server's `pretest` hook do build contracts first. Client Jest uses source mappings for its test runner.

Docker builds compile contracts into the development image. The client container also watches and recompiles them. The API watcher notices contracts source changes but currently rebuilds only Express, so rebuild/recreate the Docker services after changing contracts as described in the [root guide](../../README.md#docker-development).

See [architecture and adding endpoints](../../docs/architecture.md) for how both applications consume these definitions.
