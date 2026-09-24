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

## Docker development

From the repository root:

```sh
docker compose up --build --watch
```

Open http://localhost:5173. The API listens at http://localhost:5001. Compose runs only the API and Astro dev server; both connect to hosted services, including the Supabase project in `server/.env`.

Compose Watch synchronizes source changes into the containers. Astro hot reloads, the client recompiles shared contracts in watch mode, and the API rebuilds contracts and restarts through nodemon. Dependencies and build output stay inside the containers. Package manifest and lockfile changes trigger image rebuilds.

Astro proxies API requests to `http://api:5001` inside Docker. Optional client environment settings can go in `client/.env`. Plain `docker compose up --build` starts a snapshot without synchronizing subsequent edits.

After changing environment files, recreate the services:

```sh
docker compose up --build --force-recreate --watch
```

Stop with `docker compose down`. Inspect startup with `docker compose logs --tail=80 client api`. Wait for server listening messages before opening the app.

## Development without Docker

Install and build contracts first:

```sh
npm ci
npm run build:contracts
```

Run these from the root in separate terminals:

```sh
npm run dev:server
```

```sh
npm run dev:client
```

The client uses port 5173 and proxies to localhost:5001. The server workspace command loads `server/.env` and rebuilds/restarts on its configured source watches.

After editing contracts, run `npm run build:contracts` and restart the local API. Alternatively, run the contracts compiler in another terminal:

```sh
npm run build --workspace=@elenchus/contracts -- --watch
```

The local server watcher does not watch the contracts package; Docker's watcher does.

Password-reset emails currently use the production redirect URL in `userWriteHandler.ts`. Running locally does not automatically change that URL or Supabase's redirect configuration.

## Build and verification

Run from the repository root:

```sh
npm run typecheck
npm run build
npm exec --workspace=elenchus -- jest --runInBand
node --test server/tests/routeContracts.test.mjs
```

The full build compiles contracts, then the server, then the client. Server route tests import compiled output, so build before running them. Client Jest maps contracts imports to shared TypeScript source.

Individual build commands are `npm run build:contracts`, `npm run build:server`, and `npm run build:client`; application build commands compile contracts first.

## Production serving

Express serves `client/dist` alongside the API. Build all workspaces with `npm run build`, then launch `npm start` from the root. Supply required environment variables through the host; root `npm start` resolves a dotenv file from the root working directory rather than `server/.env`.

For Heroku, the existing `heroku-postbuild` script copies logo assets and runs the workspace build. Build from the repository root with development dependencies available for TypeScript and Astro. Docker Compose is configured for development.

## Contact

Trent Irvin — trentirvin51@gmail.com

Said Gadzhiev — saga080700@gmail.com

[Project repository](https://github.com/TrentM1997/ElenchusBackup)
