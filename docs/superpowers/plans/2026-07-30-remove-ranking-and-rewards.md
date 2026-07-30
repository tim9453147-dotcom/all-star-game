# Remove Ranking and Rewards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all ranking (leaderboard) and reward-related code, endpoints, database schema references, and UI components from the All-Star application.

**Architecture:** Simplify the frontend and backend by eliminating rewards API routes, rewards administration pages, leaderboard UI sidebars, and rewards data structures while leaving player points and Monopoly board movement fully intact.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, TailwindCSS, Nitro Server API, SQLite / D1.

## Global Constraints

- Do not alter the core player points accumulation or Monopoly board cell positioning logic.
- Remove all `rewards` and `ranking` references from both frontend UI and backend API.

---

### Task 1: Delete Reward API Endpoints & DB Helper Cleanups

**Files:**
- Delete: `server/api/rewards.get.ts`
- Delete: `server/api/admin/rewards/index.get.ts`
- Delete: `server/api/admin/rewards/index.post.ts`
- Delete: `server/api/admin/rewards/[id].patch.ts`
- Modify: `server/api/admin/dashboard.get.ts`
- Modify: `server/database/migrations/0001_initial.sql`

- [ ] **Step 1: Delete reward API files**

Remove `server/api/rewards.get.ts` and the `server/api/admin/rewards` directory.

- [ ] **Step 2: Remove ranking topPlayers from server/api/admin/dashboard.get.ts**

Remove the `topPlayers` SQL query and return value from `server/api/admin/dashboard.get.ts`.

- [ ] **Step 3: Clean up server/database/migrations/0001_initial.sql**

Remove the `rewards` table schema and initial rewards seed `INSERT` statements.

- [ ] **Step 4: Verify server endpoints compile / work cleanly**

Run dev server check or build to ensure Nitro routing builds without missing imports.

---

### Task 2: Remove Rewards & Ranking Frontend Pages, Composables, and Layouts

**Files:**
- Delete: `app/pages/rewards.vue`
- Delete: `app/pages/admin/rewards.vue`
- Modify: `app/composables/useApi.ts`
- Modify: `app/layouts/default.vue`
- Modify: `app/layouts/admin.vue`
- Modify: `app/pages/apply.vue`

- [ ] **Step 1: Delete frontend reward pages**

Delete `app/pages/rewards.vue` and `app/pages/admin/rewards.vue`.

- [ ] **Step 2: Update composables/useApi.ts**

Remove `fetchRewards` from `app/composables/useApi.ts`.

- [ ] **Step 3: Update app/layouts/default.vue**

Remove `{ to: '/rewards', label: '獎勵', icon: '🎁' }` from `navLinks`.
Update grid layout in mobile navigation dock to `grid-cols-2`.
Update footer text.

- [ ] **Step 4: Update app/layouts/admin.vue**

Remove `{ to: '/admin/rewards', label: '獎勵管理', icon: '🎁' }` from `navItems`.

- [ ] **Step 5: Update app/pages/apply.vue**

Remove the bullet point line for rewards in `apply.vue`.

---

### Task 3: Clean Up Main Index Page and Admin Index Page

**Files:**
- Modify: `app/pages/index.vue`
- Modify: `app/pages/admin/index.vue`
- Modify: `nuxt.config.ts`
- Modify: `README.md`

- [ ] **Step 1: Refactor app/pages/index.vue**

- Remove mobile view tabs (`activeMobileTab` logic and mobile tab buttons).
- Remove right-side Leaderboard & Rewards column sidebar.
- Remove `rewardsData`, `Reward` interface, `milestonePositions`, cell `isMilestone` check and `🎁` icon rendering.
- Adjust board layout container to center the Monopoly board cleanly.

- [ ] **Step 2: Refactor app/pages/admin/index.vue**

- Remove "🏆 積分排行 Top 5" block from admin dashboard.
- Re-layout admin dashboard cards and quick actions section.

- [ ] **Step 3: Update nuxt.config.ts and README.md**

- Update `nuxt.config.ts` meta description.
- Remove references to rewards and ranking from `README.md`.

- [ ] **Step 4: Verify build**

Run `bun run build` to verify there are no TypeScript errors, missing routes, or broken imports.
