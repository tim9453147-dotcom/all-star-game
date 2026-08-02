# Task Soft Delete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement soft deletion for tasks in task management so tasks can be hidden/removed while preserving historical score records (`score_records`) and player score totals (`players.total_score`).

**Architecture:** Add `is_deleted INTEGER DEFAULT 0` column to `tasks` table. Create `DELETE /api/admin/tasks/[id]` to set `is_deleted = 1`. Update `GET /api/admin/tasks` to exclude soft-deleted tasks. Add a Delete button and confirmation modal to `app/pages/admin/tasks.vue`.

**Tech Stack:** Nuxt 3, H3 / Nitro API routes, SQLite / Cloudflare D1, Vue 3 Composition API, Tailwind CSS.

## Global Constraints

- Preserve all existing `score_records` and `players.total_score` data.
- Ensure admin authorization (`requireAdminSession(event)`) on all task API routes.

---

### Task 1: Database Schema & Auto-Migration (`server/utils/db.ts`)

**Files:**
- Modify: `server/utils/db.ts`

**Interfaces:**
- Consumes: SQLite / D1 `tasks` table schema.
- Produces: `tasks` table with `is_deleted INTEGER DEFAULT 0` column.

- [ ] **Step 1: Update initial schema statement in `server/utils/db.ts`**

Update `INITIAL_SCHEMA_STATEMENTS` in `server/utils/db.ts` to include `is_deleted INTEGER DEFAULT 0`:

```typescript
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  is_deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

- [ ] **Step 2: Add runtime migration for existing databases in `ensureD1Tables`**

In `ensureD1Tables(db)` in `server/utils/db.ts`, add a check and safe `ALTER TABLE` execution so existing databases get the `is_deleted` column automatically:

```typescript
try {
  await db.prepare("ALTER TABLE tasks ADD COLUMN is_deleted INTEGER DEFAULT 0").run()
} catch (e) {
  // Column already exists, ignore error
}
```

- [ ] **Step 3: Test database table initialization**

Run: `bun run dev` or a quick node/bun script to verify database connection initialization without errors.

- [ ] **Step 4: Commit schema changes**

```bash
git add server/utils/db.ts
git commit -m "feat(db): add is_deleted column and migration for tasks table"
```

---

### Task 2: Task API Routes (`GET` & `DELETE`)

**Files:**
- Modify: `server/api/admin/tasks/index.get.ts`
- Create: `server/api/admin/tasks/[id].delete.ts`

**Interfaces:**
- Consumes: Admin session via `requireAdminSession(event)`, D1 DB instance via `useDB(event)`.
- Produces: API response for task listing and task deletion.

- [ ] **Step 1: Update `GET /api/admin/tasks` to exclude deleted tasks**

Modify `server/api/admin/tasks/index.get.ts`:

```typescript
import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = await useDB(event)
  const { results } = await db.prepare("SELECT * FROM tasks WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC").all()
  return results
})
```

- [ ] **Step 2: Create `DELETE /api/admin/tasks/[id].delete.ts`**

Create `server/api/admin/tasks/[id].delete.ts`:

```typescript
import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'Task ID is required' })
  }

  const db = await useDB(event)

  const result = await db.prepare(
    "UPDATE tasks SET is_deleted = 1, updated_at = datetime('now') WHERE id = ?1 RETURNING *"
  ).bind(id).first()

  if (!result) {
    throw createError({ statusCode: 404, message: 'Task not found' })
  }

  return { success: true, id, message: 'Task deleted successfully' }
})
```

- [ ] **Step 3: Test API Endpoints**

Verify API endpoints respond cleanly.

- [ ] **Step 4: Commit API changes**

```bash
git add server/api/admin/tasks/index.get.ts server/api/admin/tasks/\[id\].delete.ts
git commit -m "feat(api): filter deleted tasks on GET and implement DELETE endpoint"
```

---

### Task 3: Task Management Frontend (`app/pages/admin/tasks.vue`)

**Files:**
- Modify: `app/pages/admin/tasks.vue`

**Interfaces:**
- Consumes: `/api/admin/tasks` GET, PATCH, DELETE APIs.
- Produces: Task list UI with Delete button and confirmation modal.

- [ ] **Step 1: Add confirmation state and modal script logic**

In `app/pages/admin/tasks.vue`:
Add state for deletion confirmation:

```typescript
const taskToDelete = ref<Task | null>(null)
const deleting = ref(false)

function confirmDelete(task: Task) {
  taskToDelete.value = task
}

async function executeDelete() {
  if (!taskToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/tasks/${taskToDelete.value.id}`, { method: 'DELETE' })
    showMessage('任務已成功刪除！')
    taskToDelete.value = null
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '刪除失敗', 'error')
  } finally {
    deleting.value = false
  }
}
```

- [ ] **Step 2: Add Delete buttons in template**

In mobile card view and desktop table view, add a "刪除" button next to "編輯" and "停用/啟用":

```html
<button
  class="px-2.5 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium hover:bg-rose-500/25 transition"
  @click="confirmDelete(task)"
>
  刪除
</button>
```

- [ ] **Step 3: Add Delete Confirmation Modal UI**

Render a modal when `taskToDelete` is non-null:

```html
<div v-if="taskToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
  <div class="bg-surface-800 border border-surface-700 rounded-xl p-5 max-w-sm w-full shadow-2xl space-y-4">
    <h3 class="text-base font-bold text-white">確認刪除任務</h3>
    <p class="text-xs text-surface-300 leading-relaxed">
      您確定要刪除任務 <span class="text-amber-400 font-bold">『{{ taskToDelete.name }}』</span> 嗎？
      <br/>歷史累計的玩家積分紀錄將會完好保留，但此任務將無法再被選取。
    </p>
    <div class="flex justify-end gap-2 pt-2">
      <button
        @click="taskToDelete = null"
        class="px-3.5 py-1.5 rounded-lg bg-surface-700 text-surface-300 hover:text-white text-xs font-medium transition"
        :disabled="deleting"
      >
        取消
      </button>
      <button
        @click="executeDelete"
        class="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition active:scale-95 disabled:opacity-50"
        :disabled="deleting"
      >
        {{ deleting ? '刪除中...' : '確認刪除' }}
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Commit Frontend changes**

```bash
git add app/pages/admin/tasks.vue
git commit -m "feat(ui): add delete button and confirmation modal to task management page"
```
