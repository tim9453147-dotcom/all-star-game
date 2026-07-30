# Cloudflare Deployment & Just Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure Cloudflare Pages deployment and D1 migration scripts in `all-star-game` to match `course-schedule`, enabling one-command deployment via `just release "message"`.

**Architecture:** Update `nuxt.config.ts` Nitro preset to `cloudflare-pages`, update `wrangler.toml` for `dist/` output and D1 migrations directory, update `package.json` scripts and devDependencies, and create `justfile`.

**Tech Stack:** Nuxt 4, Cloudflare Pages, Cloudflare D1, Wrangler 4, Just, Bun.

## Global Constraints

- Output directory: `dist`
- D1 database name: `all-star-game-db`
- D1 database ID: `3f70f99b-ae7b-4b11-8f93-cee357a71c32`
- D1 migrations path: `server/database/migrations`
- Project name: `all-star-game`

---

### Task 1: Update Configuration Files (`nuxt.config.ts`, `wrangler.toml`, `package.json`)

**Files:**
- Modify: `nuxt.config.ts`
- Modify: `wrangler.toml`
- Modify: `package.json`

**Interfaces:**
- Consumes: Existing project structure
- Produces: Cloudflare Pages preset build config and D1 wrangler migration settings

- [ ] **Step 1: Update `nuxt.config.ts`**

Add Nitro preset configuration:
```ts
  nitro: {
    preset: 'cloudflare-pages'
  },
```

- [ ] **Step 2: Update `wrangler.toml`**

Update `wrangler.toml` content:
```toml
name = "all-star-game"
compatibility_date = "2025-07-15"
compatibility_flags = ["nodejs_compat"]

# Cloudflare Pages build output directory
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "DB"
database_name = "all-star-game-db"
database_id = "3f70f99b-ae7b-4b11-8f93-cee357a71c32"
migrations_dir = "server/database/migrations"
```

- [ ] **Step 3: Update `package.json`**

Add `typecheck`, `db:migrate:local`, `db:migrate:remote`, and `deploy` scripts, and `wrangler` devDependency:
```json
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck",
    "db:migrate:local": "wrangler d1 migrations apply all-star-game-db --local",
    "db:migrate:remote": "wrangler d1 migrations apply all-star-game-db --remote",
    "deploy": "nuxt build && wrangler pages deploy dist --project-name all-star-game --branch main"
  },
  "devDependencies": {
    "wrangler": "^3.100.0"
  }
```

- [ ] **Step 4: Run `bun install`**

Run: `PATH="$HOME/.local/share/fnm/node-versions/v24.17.0/installation/bin:$PATH" bun install`
Expected: Installation completes successfully and wrangler is available.

- [ ] **Step 5: Commit**

```bash
git add nuxt.config.ts wrangler.toml package.json bun.lock
git commit -m "config: update Cloudflare Pages & D1 wrangler settings"
```

---

### Task 2: Create `justfile`

**Files:**
- Create: `justfile`

**Interfaces:**
- Consumes: Scripts in `package.json`
- Produces: `just release`, `just deploy`, `just db-migrate-remote`, `just dev`, `just build`, `just typecheck`

- [ ] **Step 1: Write `justfile`**

Create `justfile` with fnm PATH export and standard workflow recipes:
```just
export PATH := env_var('HOME') / ".local/share/fnm/node-versions/v24.17.0/installation/bin:" + env_var('PATH')

# List all commands
default:
    @just --list

# Install dependencies
install:
    bun install

# Development server
dev:
    bun dev

# Production build -> dist/
build:
    bun run build

# Type check
typecheck:
    bun run typecheck

# Apply migrations to local D1
db-migrate-local:
    bun run db:migrate:local

# Apply migrations to remote D1
db-migrate-remote:
    bun run db:migrate:remote

# Build & deploy to Cloudflare Pages
deploy:
    bun run deploy

# git push -> remote DB migrate -> deploy
release MSG:
    git add -A && git commit -m "{{MSG}}" && git push
    bun run db:migrate:remote
    bun run deploy

# Call wrangler directly
wrangler *args:
    bunx wrangler {{args}}
```

- [ ] **Step 2: Test `just` recipes list**

Run: `just`
Expected: Output shows all available recipes (`build`, `db-migrate-local`, `db-migrate-remote`, `deploy`, `dev`, `install`, `release`, `typecheck`, `wrangler`).

- [ ] **Step 3: Commit**

```bash
git add justfile
git commit -m "feat: add justfile for release workflow"
```

---

### Task 3: Verify Build, D1 Migration, and Deployment

**Files:**
- None (verification task)

**Interfaces:**
- Consumes: `justfile`, `wrangler.toml`, `server/database/migrations`
- Produces: Verified deployment pipeline

- [ ] **Step 1: Run typecheck**

Run: `just typecheck`
Expected: PASS with 0 errors.

- [ ] **Step 2: Check remote D1 migrations**

Run: `just wrangler d1 migrations list all-star-game-db --remote`
Expected: Output shows `0001_initial.sql` detected under `server/database/migrations`.

- [ ] **Step 3: Run production build**

Run: `just build`
Expected: Build outputs to `dist/` including `dist/_worker.js`.

- [ ] **Step 4: Verify D1 remote migration apply**

Run: `just db-migrate-remote` (or test with wrangler directly)
Expected: D1 migration successfully executed or up-to-date.

- [ ] **Step 5: Verify deployment**

Run: `just deploy`
Expected: Successfully deployed to `https://all-star-game.pages.dev`.
