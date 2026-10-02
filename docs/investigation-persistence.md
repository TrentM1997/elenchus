# Investigation persistence and database setup

An investigation combines the user's before-and-after perspective, article sources, and Wikipedia context. Saving and opening it must preserve those pieces together. See [the architectural rationale](architecture.md#investigations-are-complete-research-records).

## Database objects

The hosted Supabase project must already contain these tables and their required columns, constraints, defaults, and policies:

| Table | Purpose |
| --- | --- |
| `investigations` | The user's framing and reflection, ownership, and investigation identity |
| `articles` | Previously persisted articles referenced by investigations |
| `investigation_sources` | Links an investigation and its owner to existing article IDs |
| `investigation_extracts` | Saved Wikipedia summaries and disambiguation extracts |
| `investigation_extract_candidates` | Candidates belonging to a disambiguation extract, including their position |
| `notes` | Tiptap JSON documents linked to their investigation and owner |

The SQL files below define functions and execution grants; they do not create these tables. They are not a complete empty-database bootstrap. The generated [database types](../server/types/databaseInterfaces.ts) describe the schema used by the server, but do not install database objects.

The `notes` table requires `content jsonb NOT NULL`, non-null investigation and user IDs, generated UUID and creation timestamp defaults, and the composite foreign key `(investigation_id, user_id)` referencing `investigations(id, user_id)`.
## Save RPC

[001save_complete_investigation.sql](../server/db/access/migrations/001save_complete_investigation.sql) defines `public.save_complete_investigation`.

| Argument | Meaning |
| --- | --- |
| `p_user_id uuid` | User ID obtained from the authenticated server request |
| `p_investigation jsonb` | Validated framing and reflection fields |
| `p_article_ids bigint[]` | IDs of articles already persisted by the application |
| `p_extracts jsonb` | Array of selected Wikipedia summaries or disambiguation extracts |
| `p_notes jsonb` | Array of `{ content: ... }` notes; defaults to `[]` when omitted |

The function inserts a new investigation, links its articles, and inserts its extracts, disambiguation candidates, and notes within one transaction. An error rolls back those writes together. It does not scrape or create articles. It casts supplied `lastUpdated` values to timestamps, treating an empty string as NULL.

The [write handler](../server/db/access/repositories/investigations/InvestigationWriteHandler.ts) calls `.rpc("save_complete_investigation", args)`, handles database errors, and validates the returned payload. The SQL file is not imported into TypeScript: `.rpc()` calls the function already installed in the database.

Each successful call creates a new investigation. This is not an update or an idempotent operation. Do not automatically retry a save after a lost response: the first call may already have committed.

Omitted notes and empty arrays insert no notes; explicit NULL and non-array inputs are rejected. Each element must contain a content object. Notes use the authenticated user ID and newly inserted investigation ID. The save script removes the old four-argument signature before defining the five-argument function and its permissions in one transaction.

Application integration must forward `notes ?? []` as `p_notes`, include notes in the selected-investigation response schema, and hydrate the client note collection. Regenerate database types after applying the scripts.

## Hydration RPC and payload

[002hydrate_investigation.sql](../server/db/access/migrations/002hydrate_investigation.sql) defines `public.hydrate_investigation(p_user_id uuid, p_investigation_id bigint)`.

It selects the investigation and assembles its sources and extracts in one SQL statement. Both RPCs return this JSON shape:

```ts
{
  investigation: /* saved investigation row */,
  sources: /* full article rows, not source-link rows or IDs */ [],
  extracts: /* saved extracts with nested candidates where applicable */ [],
  notes: /* complete saved note rows, including JSON content */ [],
}
```

Extracts include their saved identity and ownership fields, `kind`, `title`, `pageUrl`, and `lastUpdated`. Summary extracts include `extract`, `description`, and `thumbnail`; disambiguation extracts include `candidates`. Candidate fields include `pageid`, `title`, `extract`, `url`, `thumbnail`, and `lastUpdated`.

The save response orders sources by the supplied article-ID order. Hydration orders them by source-link creation time and ID. Both order extracts by capture time and ID, and candidates by their stored position.

Both RPCs also return `notes`, an array of complete note rows. Notes are ordered by `created_at, id`; this does not preserve input or tab order. Empty collections return `[]`. Hydration returns SQL NULL when the investigation does not exist or belongs to another user. The [select handler](../server/db/access/repositories/investigations/InvestigationSelectHandler.ts) converts NULL into a failed result; successful data is validated by the repository parser before it reaches the client. The repository's `{ ok, data }` result and the HTTP success envelope are separate from the RPC payload.

The SQL reconstructs existing records; it cannot establish whether context was lost before it was stored. An empty collection is not itself evidence of a failed read. The atomic save prevents partial writes through this save operation.

## Ownership and execution permissions

Both functions use `security invoker` and an empty `search_path`, with application tables explicitly qualified by `public`. Their scripts revoke execution from `PUBLIC`, `anon`, and `authenticated`, and grant execution to `service_role`. Run the entire scripts, including those grants.

These RPCs are called by the server's service-key database client. The browser must not receive that key or call these functions directly. The server supplies `p_user_id` from its authenticated request, through the authorization and service layers; it must not trust a user ID supplied in the browser's save payload.

Hydration explicitly filters the investigation by both ID and owner, filters source links and extracts by owner, and selects candidates through the matching extracts. Saving assigns the authenticated user ID to the investigation, source links, and extracts. Since the caller uses service-role access, preserving these server checks and SQL ownership filters is essential; `security invoker` does not independently establish the end user's identity.

## Installing or updating the functions

The app startup, npm builds, and Docker Compose do not apply these SQL files to Supabase. Editing a local file alone does not change the hosted function.

1. Select the intended Supabase project and open its SQL Editor.
2. Paste the complete contents of `001save_complete_investigation.sql` into a query and run it.
3. Paste the complete contents of `002hydrate_investigation.sql` into a query and run it.
4. Confirm each execution succeeded. “Success. No rows returned” is expected when defining functions; it does not mean a save or hydration was executed.
5. Regenerate database types and verify the application as described below.

For later function-body changes, update the version-controlled SQL and run that updated script against the intended project. The current `create or replace function` statements support replacing the existing definitions with the same signatures. Argument or return-type changes need a deliberate database migration; do not assume they simply replace the old signature. Apply database changes to every environment that will run the corresponding server code.

## Regenerating database types

Generate types after installing the functions for the first time and after database schema or function-signature changes. Function-body-only changes that preserve the signature and return type do not necessarily change generated types. JSON payload changes still require matching shared schemas, parser expectations, and tests: a generated `jsonb` return type does not describe its internal fields.

The Supabase CLI needs authentication with access to the project. If necessary, authenticate with `npx supabase login`. This is CLI account access, separate from the server's runtime service key.

From the repository root:

```sh
npm run db:codegen --workspace=server
```

Or from `server/`:

```sh
npm run db:codegen
```

The [generator](../server/scripts/generateDatabaseTypes.mjs) targets project `ovpngiqjmjwqsjgwrrph` and schema `public`; it does not derive the project from `SUPABASE_URL`. Check that target before generating for a different environment. It writes UTF-8 to `server/types/databaseInterfaces.ts` only after successful, nonempty generation, preserving the existing file if the CLI fails.

Review and commit the generated diff alongside SQL and application changes. If `.rpc("function_name", ...)` reports that the function name is not assignable to `never`, check that the function exists in the target project's public schema and that the generated `Database` types include it under `public.Functions`.

## Verification

From the repository root:

```sh
npm run typecheck
npm test --workspace=server
npm exec --workspace=elenchus -- jest --runInBand
```

These checks cover application contracts and behavior but do not execute the SQL against Supabase. Verify database changes in a development project with a save-and-hydrate round trip, including summaries and disambiguation candidates. Also verify that a write failure rolls back the whole save and that hydration with another user's ID or a nonexistent investigation returns NULL. Use deliberate test data for these checks.
