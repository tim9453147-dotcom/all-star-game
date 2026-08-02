# Player ID & Real Name UI Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the representation and terminology of Game ID (`player_id`) and Real Name (`name`) across API and UI, keeping UI labels clean and concise.

**Architecture:** Update backend API handlers to return both fields cleanly, and update Vue pages and components to display Game ID as the primary player handle and Real Name as secondary admin verification info.

**Tech Stack:** Nuxt 3 (Vue 3, TypeScript, SQLite/D1 via Nitro)

## Global Constraints

- Game ID (`player_id`) is the in-game handle/nickname shown on boards.
- Real Name (`name`) is the player's real name for admin verification.
- UI text should remain clean and concise without excessive explanation.

---

### Task 1: Update Server API Endpoints

**Files:**
- Modify: `server/api/players.get.ts`
- Modify: `server/api/admin/scores/index.get.ts`

- [ ] **Step 1: Update `server/api/players.get.ts`**

Update query to select `name` directly instead of aliasing `player_id as name`:
```typescript
export default defineEventHandler(async (event) => {
  const db = await useDB(event)
  const { results } = await db.prepare("SELECT id, player_id, name, total_score, status FROM players WHERE status = 'active' ORDER BY total_score DESC").all()
  return results
})
```

- [ ] **Step 2: Update `server/api/admin/scores/index.get.ts`**

Update query to include `p.player_id as player_game_id`:
```typescript
let sql = `
  SELECT s.*, p.name as player_name, p.player_id as player_game_id, t.name as task_name 
  FROM score_records s 
  LEFT JOIN players p ON s.player_id = p.id 
  LEFT JOIN tasks t ON s.task_id = t.id
`
```

- [ ] **Step 3: Commit API changes**

```bash
git add server/api/players.get.ts server/api/admin/scores/index.get.ts
git commit -m "fix(api): align player_id and name return fields in player and score endpoints"
```

---

### Task 2: Update Join Us Modal & Apply Page

**Files:**
- Modify: `app/components/JoinUsModal.vue:50-77`
- Modify: `app/pages/apply.vue:35-64`

- [ ] **Step 1: Update `JoinUsModal.vue`**

Update field labels, placeholders, and concise subtext:
- Field 1 Label: `遊戲 ID` | Placeholder: `輸入遊戲 ID`
- Field 2 Label: `姓名` | Placeholder: `輸入本名`
- Subtext: `🔒 姓名僅供管理員核對身分`

- [ ] **Step 2: Update `apply.vue`**

Apply the same clean labels, placeholders, and subtext:
- Field 1 Label: `遊戲 ID` | Placeholder: `輸入遊戲 ID`
- Field 2 Label: `姓名` | Placeholder: `輸入本名`
- Subtext: `🔒 姓名僅供管理員核對身分`

- [ ] **Step 3: Commit Form updates**

```bash
git add app/components/JoinUsModal.vue app/pages/apply.vue
git commit -m "fix(ui): simplify and clarify player ID and name labels in application forms"
```

---

### Task 3: Update Admin Players Page

**Files:**
- Modify: `app/pages/admin/players.vue`

- [ ] **Step 1: Update Header, Card, and Table views in `admin/players.vue`**

- Search input placeholder: `搜尋姓名或 ID...` (or `搜尋本名或遊戲 ID...`)
- Mobile Card Avatar: `player.player_id ? player.player_id.charAt(0) : '?'`
- Mobile Card Title: Primary is `player.player_id`, secondary/subtitle is `(本名: {{ player.name }})`
- Table Headers: `遊戲 ID`, `姓名`, `總積分`, `狀態`, `加入時間`, `操作`
- Table Rows: Column 1 shows `player.player_id`, Column 2 shows `player.name`

- [ ] **Step 2: Commit Admin Players Page updates**

```bash
git add app/pages/admin/players.vue
git commit -m "fix(admin): update player list display to prioritize game ID over real name"
```

---

### Task 4: Update Admin Scores Page

**Files:**
- Modify: `app/pages/admin/scores.vue`

- [ ] **Step 1: Update Player Selection & Records Table in `admin/scores.vue`**

- Form Player Select option: `{{ p.player_id }} ({{ p.name }}) — {{ p.total_score }} 分`
- Filter Player Select option: `{{ p.player_id }} ({{ p.name }})`
- Records Table Player Column: Display `{{ record.player_game_id || record.player_name }}` (with `record.player_name` in muted text if `player_game_id` exists)
- Search filter: Include search on `r.player_game_id`

- [ ] **Step 2: Commit Admin Scores Page updates**

```bash
git add app/pages/admin/scores.vue
git commit -m "fix(admin): update score management player labels and record displays"
```
