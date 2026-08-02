# Admin UI/UX Minimalist Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove redundant dashboard view and clutter, and redesign the Admin pages into an ultra-clean, minimalist Dark UI (Vercel/Apple style).

**Architecture:** Nuxt 3 layout and page restructuring. Direct navigation redirect from `/admin` to `/admin/players`, removal of decorative emoji overload and excessive summary cards, and streamlined UI components with Tailwind CSS utilities.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, TypeScript.

## Global Constraints

- Keep existing backend API endpoints untouched (`/api/admin/dashboard`, `/api/admin/players`, `/api/admin/tasks`, `/api/admin/scores`).
- Maintain full functionality (Search, Filter, Status updates, Task CRUD, Score distribution).
- Ensure mobile responsiveness for screen widths from 360px up to 4K displays.

---

### Task 1: Admin Layout & Navigation Simplification

**Files:**
- Modify: `app/layouts/admin.vue`
- Modify: `app/pages/admin/index.vue`

**Interfaces:**
- Consumes: `/api/admin/dashboard` (for pending player count)
- Produces: Clean 3-tab layout (`/admin/players`, `/admin/tasks`, `/admin/scores`) and auto-redirect from `/admin`.

- [ ] **Step 1: Update `app/layouts/admin.vue` navigation items and header styling**

Remove '儀表板' from `navItems`. Set nav items to:
```ts
const navItems = [
  { to: '/admin/players', label: '玩家管理', icon: '👥' },
  { to: '/admin/tasks', label: '任務管理', icon: '📋' },
  { to: '/admin/scores', label: '積分管理', icon: '⭐' },
]
```
Clean up brand headers: change header to "All-Star 管理" without extra "控制面板" subtitle. Streamline sidebar and bottom mobile nav.

- [ ] **Step 2: Update `app/pages/admin/index.vue` to redirect to `/admin/players`**

Replace `index.vue` content with instant redirect:
```vue
<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
await navigateTo('/admin/players', { replace: true })
</script>
<template>
  <div class="flex items-center justify-center min-h-[50vh] text-surface-400 text-sm">
    正在載入玩家管理...
  </div>
</template>
```

- [ ] **Step 3: Commit Task 1**

```bash
git add app/layouts/admin.vue app/pages/admin/index.vue
git commit -m "refactor(admin): remove dashboard and simplify layout navigation"
```

---

### Task 2: Redesign Players Management Page

**Files:**
- Modify: `app/pages/admin/players.vue`

**Interfaces:**
- Consumes: `/api/admin/players`
- Produces: High-density, minimalist player management list & modal/card controls.

- [ ] **Step 1: Redesign `app/pages/admin/players.vue` header and filter tabs**

Remove top header banner. Consolidate Title ("👥 玩家管理"), count badge, search bar, and filter tabs (`[全部, 待審核, 已核准, 已拒絕, 已禁用]`) into a clean, unified top section with subtle border dividers.

- [ ] **Step 2: Redesign player list (Desktop Table & Mobile Cards)**

- Remove redundant labels ("ID:", "狀態:").
- Style status badges with minimalist dot indicators:
  - Active: `● 已核准` (emerald)
  - Pending: `● 待審核` (amber)
  - Rejected: `● 已拒絕` (rose)
  - Disabled: `● 已禁用` (gray)
- Streamline action buttons (核准, 拒絕, 重置, 禁用) into compact, borderless/subtle-bordered buttons.

- [ ] **Step 3: Commit Task 2**

```bash
git add app/pages/admin/players.vue
git commit -m "style(admin): streamline players page into minimalist layout"
```

---

### Task 3: Redesign Tasks Management Page

**Files:**
- Modify: `app/pages/admin/tasks.vue`

**Interfaces:**
- Consumes: `/api/admin/tasks`
- Produces: Streamlined task management table and collapsible form.

- [ ] **Step 1: Clean up top bar & task creation form**

- Merge title ("📋 任務管理"), total count, search bar, and "+ 新增任務" button.
- Make the Add Task Form sleek and collapsible with modern input styles and concise form labels.

- [ ] **Step 2: Clean up task list table & card UI**

- Remove unnecessary decorative badges and text clutter.
- Format task status toggles and action buttons (編輯/刪除) with clean minimalist styling.

- [ ] **Step 3: Commit Task 3**

```bash
git add app/pages/admin/tasks.vue
git commit -m "style(admin): optimize tasks page with clean minimalist UI"
```

---

### Task 4: Redesign Scores Management Page

**Files:**
- Modify: `app/pages/admin/scores.vue`

**Interfaces:**
- Consumes: `/api/admin/scores`
- Produces: Minimalist score distribution panel and transaction log table.

- [ ] **Step 1: Clean up header & score distribution form**

- Unified header bar with record count and "發放積分" trigger button.
- Streamline player dropdown selector and points input fields.

- [ ] **Step 2: Redesign score history table**

- Present chronological records in a clean, compact table.
- Display timestamp, player name, points badge (`+100` / `-50`), reason, and operator info clearly.

- [ ] **Step 3: Commit Task 4**

```bash
git add app/pages/admin/scores.vue
git commit -m "style(admin): streamline scores page into minimalist view"
```

---

### Task 5: Build & Verification

**Files:**
- All modified admin files.

- [ ] **Step 1: Execute type check / build test**

Run: `npx nuxi build` or `bun run build` to ensure no Nuxt or Vue syntax/type errors.

- [ ] **Step 2: Commit final verification**

```bash
git add .
git commit -m "chore(admin): verify build and complete minimalist UI optimization"
```
