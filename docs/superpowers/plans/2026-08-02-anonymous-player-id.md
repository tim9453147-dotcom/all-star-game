# Anonymous Player ID Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the public game interface displays player IDs instead of real names to maintain player anonymity while preserving name collection and visibility for administrators.

**Architecture:** Sanitize public API endpoints (`/api/players`) so `name` equals `player_id` in public network payloads, update all front-end game board components and modals to render `player_id`, and update registration forms with privacy notes.

**Tech Stack:** Nuxt 3, Vue 3, TypeScript, SQLite (Cloudflare D1 / Nitro DB).

## Global Constraints

- Never display real player names in public game views (`WindingBoard`, `HexBoard`, `CircuitBoard`, `MatrixBoard`, `RingBoard`, `SpiralBoard`, `PlayerDetailModal`).
- Preserve player name field and functionality in `/admin/*` pages and endpoints.
- Preserve player name entry in registration forms (`apply.vue`, `JoinUsModal.vue`) with clear user notice.

---

### Task 1: Sanitize Public Player API Endpoint

**Files:**
- Modify: `server/api/players.get.ts`

**Interfaces:**
- Consumes: Database query results from `players` table (`id`, `player_id`, `name`, `total_score`, `status`).
- Produces: Array of public player objects where `name` is overridden with `player_id`.

- [ ] **Step 1: Inspect and update `server/api/players.get.ts`**

Update `server/api/players.get.ts` to map the results so that `name` equals `player_id`:

```typescript
export default defineEventHandler(async (event) => {
  const db = await useDB(event)
  const { results } = await db.prepare("SELECT id, player_id, player_id as name, total_score, status FROM players WHERE status = 'active' ORDER BY total_score DESC").all()
  return results
})
```

- [ ] **Step 2: Verify endpoint via curl / dev server**

Run: `npx nuxt typecheck` or test endpoint logic.

- [ ] **Step 3: Commit changes**

```bash
git add server/api/players.get.ts
git commit -m "feat(api): sanitize public players endpoint to hide real names"
```

---

### Task 2: Update Game Board Components to Display Player ID

**Files:**
- Modify: `app/components/WindingBoard.vue:85-88`
- Modify: `app/components/CircuitBoard.vue:51-54`
- Modify: `app/components/HexBoard.vue:60-63`
- Modify: `app/components/MatrixBoard.vue:40`
- Modify: `app/components/RingBoard.vue:74-79`
- Modify: `app/components/SpiralBoard.vue:79-82`

**Interfaces:**
- Consumes: `Player` objects with `player_id` property.
- Produces: Board UI rendering `player_id` and initial letter `player_id.charAt(0)`.

- [ ] **Step 1: Update `app/components/WindingBoard.vue`**

In `app/components/WindingBoard.vue`, update line 85-88:

```html
:title="player.player_id"
@click.stop="$emit('select-player', player)"
>
  {{ player.player_id.charAt(0).toUpperCase() }}
```

- [ ] **Step 2: Update `app/components/CircuitBoard.vue`**

In `app/components/CircuitBoard.vue`, update `title` and inner text:

```html
:title="player.player_id"
>
  {{ player.player_id.charAt(0).toUpperCase() }}
```

- [ ] **Step 3: Update `app/components/HexBoard.vue`**

In `app/components/HexBoard.vue`, update `title` and inner text:

```html
:title="player.player_id"
>
  {{ player.player_id.charAt(0).toUpperCase() }}
```

- [ ] **Step 4: Update `app/components/MatrixBoard.vue`**

In `app/components/MatrixBoard.vue`, update inner text to `player.player_id.charAt(0).toUpperCase()`.

- [ ] **Step 5: Update `app/components/RingBoard.vue`**

In `app/components/RingBoard.vue`, update text displaying player name:

```html
{{ player.player_id.charAt(0).toUpperCase() }}
<div class="font-bold text-white">{{ player.player_id }}</div>
```

- [ ] **Step 6: Update `app/components/SpiralBoard.vue`**

In `app/components/SpiralBoard.vue`, update `title` and initial text:

```html
:title="player.player_id"
>
  {{ player.player_id.charAt(0).toUpperCase() }}
```

- [ ] **Step 7: Commit board component updates**

```bash
git add app/components/WindingBoard.vue app/components/CircuitBoard.vue app/components/HexBoard.vue app/components/MatrixBoard.vue app/components/RingBoard.vue app/components/SpiralBoard.vue
git commit -m "feat(ui): update game board components to display player ID instead of name"
```

---

### Task 3: Update `PlayerDetailModal` Component

**Files:**
- Modify: `app/components/PlayerDetailModal.vue:22-32`

**Interfaces:**
- Consumes: Selected `Player` object.
- Produces: Modal rendering `player_id` title and avatar.

- [ ] **Step 1: Update `app/components/PlayerDetailModal.vue`**

In `app/components/PlayerDetailModal.vue`, update avatar initial and title:

```html
<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-2xl font-black text-white shadow-xl ring-2 ring-white/20">
  {{ player.player_id ? player.player_id.charAt(0).toUpperCase() : '?' }}
</div>
<div>
  <div class="flex items-center gap-2">
    <h3 class="text-xl font-extrabold text-white">{{ player.player_id }}</h3>
    <span v-if="isLeader" class="px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-0.5">
      👑 第一名
    </span>
  </div>
  <p class="text-xs text-surface-400 font-mono">匿名玩家</p>
</div>
```

- [ ] **Step 2: Commit modal updates**

```bash
git add app/components/PlayerDetailModal.vue
git commit -m "feat(ui): update player detail modal to display player ID anonymously"
```

---

### Task 4: Add Privacy Helper Text to Registration Forms

**Files:**
- Modify: `app/pages/apply.vue`
- Modify: `app/components/JoinUsModal.vue`

**Interfaces:**
- Consumes: User input form for player application.
- Produces: Registration forms with explicit helper text explaining name confidentiality.

- [ ] **Step 1: Update `app/pages/apply.vue`**

Under the Name input label/field in `app/pages/apply.vue`, add helper text:

```html
<p class="mt-1 text-xs text-surface-400">🔒 姓名僅供管理員核對，遊戲畫面中只會顯示您的 ID。</p>
```

- [ ] **Step 2: Update `app/components/JoinUsModal.vue`**

In `app/components/JoinUsModal.vue`, add helper text under the Name input field:

```html
<p class="mt-1 text-xs text-surface-400">🔒 姓名僅供管理員核對，遊戲畫面中只會顯示您的 ID。</p>
```

- [ ] **Step 3: Commit registration form updates**

```bash
git add app/pages/apply.vue app/components/JoinUsModal.vue
git commit -m "docs(ui): add privacy notice on player registration forms"
```

---

### Task 5: Verification & Typecheck

**Files:**
- None (verification phase)

- [ ] **Step 1: Run typecheck**

Run: `npx nuxi typecheck` or `bun run build` / `npm run build`

- [ ] **Step 2: Verify git diff and log**

Run: `git status` and `git log -n 5` to confirm clean commits.
