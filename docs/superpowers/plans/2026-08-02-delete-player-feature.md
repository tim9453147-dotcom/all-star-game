# Delete Player Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a player deletion API endpoint and a user-friendly deletion UI with a confirmation modal to the Admin Panel.

**Architecture:** Create `server/api/admin/players/[id].delete.ts` to clear associated score records and delete the player. Update `app/pages/admin/players.vue` with a red Delete button (mobile & desktop views) and a confirmation modal.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS (Vanilla utilities), SQLite (via Nuxt server event handler & `useDB`).

## Global Constraints

- Protect administrative API endpoints with `requireAdminSession(event)`.
- Always delete associated `score_records` prior to deleting the player record in `players` table to preserve foreign key constraints.
- Display a confirmation modal before triggering the delete action to prevent accidental deletion.

---

### Task 1: Create Delete Player API Endpoint

**Files:**
- Create: `server/api/admin/players/[id].delete.ts`

**Interfaces:**
- Consumes: `requireAdminSession` from `server/utils/auth.ts`, `useDB` from `server/utils/db.ts`
- Produces: `DELETE /api/admin/players/:id` endpoint returning `{ success: true, message: string }`

- [ ] **Step 1: Create `server/api/admin/players/[id].delete.ts`**

```ts
import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Invalid player ID' })
  }

  const db = await useDB(event)

  // Verify player exists
  const existingPlayer = await db.prepare("SELECT id FROM players WHERE id = ?1").bind(id).first()
  if (!existingPlayer) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Delete score records for this player first
  await db.prepare("DELETE FROM score_records WHERE player_id = ?1").bind(id).run()

  // Delete player
  await db.prepare("DELETE FROM players WHERE id = ?1").bind(id).run()

  return { success: true, message: 'Player deleted successfully' }
})
```

- [ ] **Step 2: Commit**

```bash
git add server/api/admin/players/[id].delete.ts
git commit -m "feat: add delete player API endpoint"
```

---

### Task 2: Update Player Management Frontend with Delete Button & Modal

**Files:**
- Modify: `app/pages/admin/players.vue`

**Interfaces:**
- Consumes: `DELETE /api/admin/players/:id` endpoint

- [ ] **Step 1: Add modal state and deletion functions to `app/pages/admin/players.vue`**

In `<script setup>`, add:
```ts
const showDeleteModal = ref(false)
const targetPlayer = ref<Player | null>(null)
const isDeleting = ref(false)

function confirmDelete(player: Player) {
  targetPlayer.value = player
  showDeleteModal.value = true
}

async function executeDelete() {
  if (!targetPlayer.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/admin/players/${targetPlayer.value.id}`, { method: 'DELETE' })
    message.value = `已成功刪除玩家「${targetPlayer.value.name}」`
    messageType.value = 'success'
    showDeleteModal.value = false
    targetPlayer.value = null
    await refresh()
  } catch (e: any) {
    message.value = e.data?.message || '刪除失敗'
    messageType.value = 'error'
  } finally {
    isDeleting.value = false
    setTimeout(() => { message.value = '' }, 3000)
  }
}
```

- [ ] **Step 2: Add Delete buttons to mobile card view and desktop table view**

Mobile card view (in action buttons area):
```html
<button
  class="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium hover:bg-rose-500/20 transition flex items-center gap-1"
  @click="confirmDelete(player)"
>
  🗑️ 刪除
</button>
```

Desktop table view (in action buttons area):
```html
<button
  class="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium hover:bg-rose-500/20 transition flex items-center gap-1"
  @click="confirmDelete(player)"
>
  🗑️ 刪除
</button>
```

- [ ] **Step 3: Add Confirmation Modal HTML markup**

```html
<!-- Delete Confirmation Modal -->
<Teleport to="body">
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showDeleteModal && targetPlayer"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-surface-800 border border-surface-700 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4">
        <div class="flex items-center gap-3 text-rose-400">
          <div class="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-lg font-bold">
            ⚠️
          </div>
          <div>
            <h3 class="text-base font-bold text-white">確定要刪除玩家？</h3>
            <p class="text-xs text-surface-400">此動作無法復原</p>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-surface-300 leading-relaxed bg-surface-900/60 p-3 rounded-xl border border-surface-700/50">
          確定要刪除玩家 <span class="font-bold text-white">「{{ targetPlayer.name }}」</span>（ID: <span class="font-mono text-amber-300">{{ targetPlayer.player_id }}</span>）嗎？此動作將同時刪除該玩家的所有積分紀錄！
        </p>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            class="px-4 py-2 bg-surface-700 text-surface-200 border border-surface-600 rounded-xl text-xs font-semibold hover:bg-surface-600 transition"
            :disabled="isDeleting"
            @click="showDeleteModal = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition flex items-center gap-1.5 shadow-lg shadow-rose-500/20 disabled:opacity-50"
            :disabled="isDeleting"
            @click="executeDelete"
          >
            <span v-if="isDeleting">刪除中...</span>
            <span v-else>確認刪除</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
```

- [ ] **Step 4: Verify build / typecheck**

Run: `npx nuxi typecheck` or verify `npm run dev` / page loading.

- [ ] **Step 5: Commit**

```bash
git add app/pages/admin/players.vue
git commit -m "feat: add delete button and confirmation modal to player management"
```
