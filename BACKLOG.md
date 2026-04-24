# Backlog

Known follow-ups and deferred decisions, captured so they don't get
lost. Each entry tries to state **what**, **why it wasn't done yet**,
and **what done looks like**. Ordered roughly by impact / how cheaply
the problem compounds if ignored.

---

## Stack consolidation

### Decide whether `frontend/` + `backend/` stay

- The repo carries two parallel product implementations:
  - Active: `app/` (React 19 + Supabase Auth) + `backend-spring/`
    (Spring Boot 3.2).
  - Legacy: `frontend/` (React) + `backend/` (FastAPI).
- Both currently compile and deploy on their own stacks
  (`docker-compose.new.yml` vs `docker-compose.yml`).
- `frontend/src/api/index.ts` intentionally accepts both envelope
  shapes (`{ collections: [...] }` and `[...]`), so drift accumulates
  silently.
- **Done looks like**: an explicit decision — either the legacy
  stack is deprecated and deleted in a dedicated commit, or a short
  note in `CLAUDE.md` explains which code path is the source of
  truth for which flows. Either way, stop maintaining two API
  contracts.

### legacy `frontend/` has 21 modified + 6 untracked files

- Running `git status` against `master` today shows a large pile of
  legacy WIP (Sentry integration, SearchPage, EmptyState/Skeleton/
  ErrorBoundary, Dockerfile tweaks). Left alone this session per
  instruction.
- Risk: the diff keeps growing, eventually becoming painful to
  split into coherent commits.
- **Done looks like**: either commit those in logical groups
  ("add Sentry + search page", "UI polish", etc.) or hard-reset
  what's no longer relevant. Do **not** bulk-commit — the diff
  spans several unrelated features.

### `app/src/v2/` parallel layer

- Inside the active stack, `app/src/v2/` adds a third layer of
  pages/components alongside `app/src/pages` and
  `app/src/components`. Only accessed via `/v2-showcase`.
- Unclear whether it's a design system redo or a scratch area.
- **Done looks like**: either promote it to real pages or delete.

---

## Database & migrations

### No migration tool

- `backend/` (FastAPI) relies on hand-rolled `migrate_add_*.py`
  scripts with no ordering or state tracking. `init_db()` runs
  `SQLModel.metadata.create_all` which never alters columns.
- `backend-spring/` (Spring) dev profile uses
  `spring.jpa.hibernate.ddl-auto: update`. Prod is `validate`
  (good), but prod safety depends on dev having applied the right
  changes first.
- Both stacks share one Supabase Postgres, so schema drift between
  the two ORMs' `create_all` / `ddl-auto: update` is a real risk.
- **Done looks like**: introduce Flyway or Liquibase on the Spring
  side (owns prod), freeze FastAPI models to match, and retire the
  `migrate_*.py` scripts. Dev Spring profile should switch to
  `validate` once migrations are the source of truth.

### `claimLegacyCollections` endpoint

- `POST /api/collections/claim` in `CollectionController`. One-time
  migration to attach orphan legacy collections to a user.
- Still wired and exposed once the migration is done its purpose.
- **Done looks like**: confirm it's been run against prod, delete
  the endpoint, the service method, and any repository support.

---

## Tests

### Test coverage — scaffolding landed in 4a4d8e9, real coverage still thin

- Infra now works end-to-end:
  - `pnpm test` runs the `unit` vitest project (10 tests over
    `src/utils/format.ts`).
  - `./gradlew test` runs `YouTubeServiceTest` (10 tests over the
    URL-extraction helpers).
- Still missing:
  - Spring: a `@SpringBootTest` per controller covering happy +
    auth failure; service-layer tests for `VideoService.autoCategorize`
    (currently `private` — make it package-private to test) and the
    import-channel / import-playlist flows (needs YouTube API
    mocking).
  - app/: smoke test for `@/api/client` URL construction and
    pagination shape (needs a `fetch` stub + Supabase session mock).
    Right now the suite only touches pure utils.
  - FastAPI: no pytest at all. `backend/test_connection.py` is a
    DB-ping script, not a test.
  - CI: no workflow runs either test command yet.

---

## Security & config

### Search and stats endpoints are private by default

- `SecurityConfig.requestMatchers("/api/**").authenticated()`
  forces a JWT on `/api/search/*` and `/api/stats`. Only `trending`,
  `recent`, and `/api/videos/{id}` are public.
- Product question: should an anonymous visitor be able to browse
  a public archive and see stats, or do we want everything behind
  login?
- **Done looks like**: match the auth list to the intended
  navigation of an unauthenticated visitor. Currently the home
  page redirects to `/login` via `ProtectedRoute`, so the stricter
  default is at least internally consistent.

### ~~CORS origin list ships as localhost by default~~ — guard added in 8ac15e8

- `SecurityConfig` now throws at bean construction when the active
  profile is `production`/`prod` and `cors.allowed-origins` is empty
  or still contains `localhost` / `127.0.0.1`.
- Dev behaviour unchanged; a missing `CORS_ORIGINS` env in prod now
  fails the health check instead of serving with localhost.

### `app/.env` carries a service-role JWT — **still requires key rotation**

- `app/.env` (gitignored) contains
  `VITE_SUPABASE_ANON_KEY=eyJ…service_role…`. The token body is
  `"role":"service_role"`, not `"anon"`.
- **Mitigated in de1597f**: `src/config/supabase.ts` now decodes the
  JWT at module init and throws in production builds (warns in dev)
  if the role claim is `service_role`. Prevents recurrence, but does
  **not** fix the already-leaked token — anyone who has fetched the
  bundle while the key was live can keep using it.
- **Still to do**: regenerate the anon key in Supabase, replace
  `app/.env` with it, and rotate / revoke the service-role key in
  the Supabase dashboard. I cannot do this from code — it requires
  dashboard access.

---

## Bundle & runtime

### `app/` bundle still ships `@supabase/supabase-js` on every page

- 189 kB (49 kB gzip). Supabase is used in 9 files including
  `AuthContext`, which mounts at app root, so it has to ship
  eagerly.
- Possible win: split auth setup from the app shell — e.g., lazy
  import Supabase only after we know the user isn't on `/login`
  with a cached session. Complicated, modest upside.
- **Done looks like**: benchmark vs. the current 95 kB gzip
  initial chunk. Only pursue if it buys ≥ 20 kB gzip.

### Storybook build warns about chunks > 500 kB

- `pnpm build-storybook` green but emits the same warning Vite did
  before we split. Storybook bundles its own runtime + every story;
  our `manualChunks` config isn't applied to its build.
- Not a user-facing concern — the static output is a dev tool — but
  keeps the warning visible in logs.
- **Done looks like**: either set
  `build.chunkSizeWarningLimit: 2000` in the Storybook Vite override
  or add matching `manualChunks` for vendors.

---

## Docs & repo hygiene

### Scratch files at repo root

- `r.md`, `t.md`, `w.md`, `check.md`, `PROMPT_*.md` are gitignored
  but still sit in the working directory and show up in IDE file
  trees.
- **Done looks like**: move under `.notes/` (gitignored) or delete.
  Zero-cost, just aesthetics.

### UIKitPage is a showcase, not a contract

- `app/src/pages/UIKitPage.tsx` was out of sync with every
  component it demonstrated (Badge variants, Input.icon, Toggle
  onChange shape, Tab.content, Dropdown.items vs children). We
  re-aligned it, but the real component API lives in
  `src/components/ui/*.tsx` — UIKitPage is not the spec.
- **Done looks like**: write Storybook stories that cover every
  public component (some already exist) and delete UIKitPage, or
  add a `README.md` in `components/ui/` that clarifies the UIKit
  page is for humans, not the authoritative API.

---

## Out of scope of this backlog

- Anything inside `backend/` or `frontend/` that isn't listed here
  has been left alone per the "legacy stays intact" directive. When
  the consolidation decision above is made, reopen those folders.
- `.agent/` (MCP server config) and `CHANGELOG.md` at the root are
  both untracked and weren't touched; their ownership is unclear.
