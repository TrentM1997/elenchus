# Elenchus contracts

Private ESM package containing the shared schemas originally sourced from all
15 modules in `client/src/lib/schemas`. Request schemas, response schemas,
inferred types, and existing validators are preserved. Relative imports use
`.js` extensions so TypeScript emits imports that Node can resolve.

## Current scope

This package is an npm workspace and a dependency of both applications.
Root builds compile it first. Both applications import shared schemas directly
from this package; the old client schema modules and matching server modules
re-export these definitions for compatibility. Edit shared definitions here.

Server-only schemas and validators remain in `server/schemas`. In particular,
article insertion validation omits the database ID, and legacy extraction job
schemas differ from the client response schemas. Those differences are preserved.
No route registry has been added yet.

## Build

From the repository root:

```sh
npm ci
npm run typecheck --workspace=@elenchus/contracts
npm run build:contracts
```

Build output is written to `dist/` and includes JavaScript, declarations, and
source maps. Generated output is ignored by Git. TypeBox is pinned to 0.34.41,
the root installation currently used by the client schemas; TypeScript is pinned
to 5.9.3, matching the server compiler.

## Imports

Once built, individual modules can be imported using subpaths:

```ts
import {
  ArticleSchema,
  type ArticleSchemaType,
} from "@elenchus/contracts/schemas/articles/ArticleSchema";
```

The package root exports a namespace for each source module:

```ts
import { AuthSchemas } from "@elenchus/contracts";

const schema = AuthSchemas.ResetPasswordResponseSchema;
```

Namespaces preserve the existing duplicate names in `AuthSchemas` and
`ResetPasswordSchema` without choosing one definition over the other.

The client Jest configuration maps package subpaths to this package's TypeScript
sources so its CommonJS test runner can transform them. Application builds use
the compiled ESM exports.
