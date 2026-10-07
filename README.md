# Elenchus

Elenchus is a research application for examining assumptions, finding news articles, and saving investigations. It combines an Astro/React interface with an Express API and hosted Supabase for authentication and persistence.

Features include article discovery through NewsAPI and Bluesky, article extraction through Firecrawl, Wikipedia context, saved investigations and bookmarks, and source-bias reporting.

## Repository

| Directory             | Responsibility                                                                   |
| --------------------- | -------------------------------------------------------------------------------- |
| `client/`             | Astro pages, React UI, Redux state, and ServerClient                             |
| `server/`             | Express routes, services, persistence, authentication, and integrations          |
| `packages/contracts/` | Shared API contract between client + server, TypeBox schemas, and inferred types |

These are npm workspaces. Install dependencies from the repository root; the root lockfile is authoritative.

The client and API run as separate services. Astro builds static client files; Express handles API requests and does not serve `client/dist`. The contracts workspace is a shared code dependency, not a third service. The current Docker configuration is for development; production hosting is not configured in this repository.

See the [architecture guide](docs/architecture.md) for request flow, validation boundaries, and an endpoint walkthrough. Workspace details are in the [client guide](client/README.md) and [contracts guide](packages/contracts/README.md).

## Configuration

Local development requires Node.js 24.x and npm 11.x. Docker development requires Docker Desktop with Linux containers and Compose 2.32 or newer.

Create `server/.env` with the values read by [server configuration](server/src/Config.ts):

```dotenv
NEWS_API_KEY=<NewsAPI key>
FIRECRAWL_KEY=<Firecrawl key>
SUPABASE_URL=<hosted Supabase project URL>
SUPABASE_SERVICE_KEY=<server service key>
SUPABASE_PUBLIC_KEY=<publishable or legacy anon key>
BLUESKY_EMAIL=<Bluesky account email>
BLUESKY_PASSWORD=<Bluesky account password>
PORT=5001
```

All seven credentials are required at server startup. Use an existing Supabase project with the application's database tables and policies configured; starting the app does not provision them. Keep the service key on the server.

Investigation saving and hydration also require database functions installed in that project. Follow the [investigation persistence and database setup guide](docs/investigation-persistence.md) to install or update the RPCs and regenerate database types. Builds and Docker startup do not apply the SQL automatically.

### Client configuration and API URLs

`RequestUrlBuilder` prepends `PUBLIC_API_ORIGIN` to API paths. Configure it in `client/.env`:

| Setting | Behavior |
| --- | --- |
| Omitted or empty `PUBLIC_API_ORIGIN` | Browser requests use the client's origin. During development, Astro proxies the configured API prefixes to Express. |
| `PUBLIC_API_ORIGIN=http://localhost:5001` | The browser calls Express directly on the local machine, bypassing the Astro proxy. |
| `API_PROXY_TARGET` | Destination used by the Astro dev proxy: defaults to `http://localhost:5001`; Compose sets `http://api:5001` in the client container. |

Set `API_PROXY_TARGET` in the environment that launches Astro (Compose already does this). It is read from `process.env` in the Astro config. `api` is a Docker service hostname, so use it for the proxy target, not for the browser-facing `PUBLIC_API_ORIGIN`.

Direct browser-to-API requests include cookies and must use an origin allowed by [the server CORS configuration](server/src/corsConfig.ts). `PUBLIC_API_ORIGIN` should have no trailing slash. Public client environment values are included in the client build; changing them for a built site requires rebuilding the client.

The password-update page also reads `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` from `client/.env`. Use the project's public URL and public/anon key for those values, never the service key.

## Docker development

From the repository root:

```sh
docker compose up --build --watch
```

Open [http://localhost:4173](http://localhost:4173). The API listens at [http://localhost:5001](http://localhost:5001). Compose starts separate `client` and `api` containers from `Dockerfile.dev`; Supabase remains hosted outside Docker.

Compose Watch synchronizes source changes into the containers. Astro hot reloads, the client container recompiles shared contracts in watch mode, and the API rebuilds Express and restarts through nodemon. Dependencies and build output stay inside each container. Package manifest and lockfile changes trigger image rebuilds.

With `PUBLIC_API_ORIGIN` omitted or empty, Astro proxies API requests to `http://api:5001` inside Docker. A nonempty `PUBLIC_API_ORIGIN` makes the browser call that origin directly. Optional client environment settings can go in `client/.env`. Plain `docker compose up --build` starts a snapshot without synchronizing subsequent edits.

After changing environment files or shared contracts, rebuild and recreate the services:

```sh
docker compose up --build --force-recreate --watch
```

The API watcher notices contracts source changes, but its current restart command builds only the server. The client's contracts watcher runs in a different container and does not update the API's compiled contracts. Rebuilding the images refreshes contracts for both services.

Stop with `docker compose down`. Inspect startup with `docker compose logs --tail=80 client api`. Wait for server listening messages before opening the app.

## Development without Docker

Install and build contracts first:

```sh
npm ci
npm run build:contracts
```

Run these from the root in separate terminals:

```sh
npm run dev:server:nodemon
```

```sh
npm run dev:client
```

The client uses port 4173. With no `PUBLIC_API_ORIGIN`, its dev proxy targets localhost:5001. The server workspace command loads `server/.env` and rebuilds/restarts on its configured source watches.

After editing contracts, run `npm run build:contracts` and restart the local API. Alternatively, run the contracts compiler in another terminal:

```sh
npm run build --workspace=@elenchus/contracts -- --watch
```

The local server watcher does not watch the contracts package, so restart the API after recompiling contracts even when the contracts compiler is running in watch mode.

Password-reset emails currently use the production redirect URL in `userWriteHandler.ts`. Running locally does not automatically change that URL or Supabase's redirect configuration.

## Build and verification

Run from the repository root:

```sh
npm run typecheck
npm run build:contracts
npm run build:server
npm run build:client
npm exec --workspace=elenchus -- jest --runInBand
npm run test:server
```

Build contracts before either application. There is no root `build` script; `build:server` and `build:client` delegate to their workspace builds without compiling contracts first. `typecheck` builds contracts before checking all workspaces.

`npm run test:server` (or `npm test --workspace=server`) automatically builds contracts and the server through the server's `pretest` script, then runs `server/tests/*.test.mjs` against compiled output. Running `node --test` directly bypasses that hook. Client Jest maps contracts imports to shared TypeScript source and replaces `import.meta.env` with test values, including an empty API origin. `npm run test:client` runs the full client suite.

The [CI workflow](.github/workflows/ci.yaml) installs dependencies, runs a non-blocking audit, supplies placeholder server environment values, builds contracts and both applications, and runs both test suites. It does not deploy the app or apply database migrations.

## Build outputs and hosting

- `client/dist`: static pages and browser assets for a static host or web server.
- `server/dist`: compiled Express API. After building, run `npm run start:server` from the root. This delegates to the server workspace, where dotenv resolves `server/.env`; deployment environments can supply variables directly.
- `packages/contracts/dist`: compiled shared schemas and declarations. Keep this package available to the running server; the client build bundles the runtime schemas it uses.

The repository currently contains only `Dockerfile.dev` and a development Compose file. There is no production Compose file, root `start` script, or `heroku-postbuild` script. A production deployment needs separate static-file serving and API execution. Configure either a browser-reachable `PUBLIC_API_ORIGIN` when building the client or a web-server proxy for the API paths. Astro's development proxy is not included in the static build.

## Contact

Trent Irvin — trentirvin51@gmail.com

Said Gadzhiev — saga080700@gmail.com

[Project repository](https://github.com/TrentM1997/ElenchusBackup)
