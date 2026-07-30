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
