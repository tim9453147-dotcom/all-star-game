# Cloudflare Deployment & Just Release Design Specification

## Overview
This specification outlines the Cloudflare Pages and D1 database deployment setup for `all-star-game`, standardizing it to match the workflow used in `course-schedule`. Upon completion, running `just release "commit message"` will commit changes, push to remote, apply D1 database migrations on Cloudflare, and deploy the application to Cloudflare Pages.

## Existing Project State Analysis
- **Cloudflare Pages Project**: `all-star-game` (URL: `https://all-star-game.pages.dev`)
- **Cloudflare D1 Database**: `all-star-game-db` (`database_id`: `3f70f99b-ae7b-4b11-8f93-cee357a71c32`)
- **Migrations Directory**: `server/database/migrations` (currently contains `0001_initial.sql`)
- **Missing Configurations**:
  - `wrangler.toml`: Missing `migrations_dir = "server/database/migrations"`, `compatibility_flags = ["nodejs_compat"]`, and `pages_build_output_dir` points to `.output/public` instead of `dist`.
  - `nuxt.config.ts`: Missing `nitro: { preset: 'cloudflare-pages' }`.
  - `package.json`: Missing `wrangler` devDependency and standard `db:migrate:local`, `db:migrate:remote`, `deploy` scripts.
  - `justfile`: Missing.

## Detailed Changes

### 1. `wrangler.toml`
Update file to:
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

### 2. `nuxt.config.ts`
Add Nitro preset configuration so `nuxt build` builds directly into `dist/` with `_worker.js`:
```ts
nitro: {
  preset: 'cloudflare-pages'
}
```

### 3. `package.json`
- Add `devDependencies`: `"wrangler": "^3.100.0"` (or `"4"` to match course-schedule).
- Add `scripts`:
  - `"typecheck": "nuxt typecheck"`
  - `"db:migrate:local": "wrangler d1 migrations apply all-star-game-db --local"`
  - `"db:migrate:remote": "wrangler d1 migrations apply all-star-game-db --remote"`
  - `"deploy": "nuxt build && wrangler pages deploy dist --project-name all-star-game --branch main"`

### 4. `justfile`
Create `justfile` in project root:
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

## Verification & Testing Strategy
1. Verify `bun install` completes without issues.
2. Run `just typecheck` to verify TypeScript compiler checks.
3. Run `just db-migrate-remote` to ensure remote D1 database migrations apply clean.
4. Run `just build` to verify output artifact structure under `dist/`.
5. Verify `wrangler pages deploy` works as expected.
