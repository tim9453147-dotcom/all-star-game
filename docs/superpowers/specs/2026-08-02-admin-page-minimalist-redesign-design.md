# Design Spec: Admin UI Minimalist Redesign (管理者頁面精簡風格優化)

## 1. Overview & Goals
- **Objective**: Transform the admin interface into a high-density, sleek, minimalist management tool, eliminating unnecessary decorative text, redundant summary widgets, and non-essential dashboard views.
- **Key Requirements**:
  1. Remove `/admin` dashboard page (redirect to `/admin/players`).
  2. Remove "儀表板" from sidebar and mobile navigation.
  3. Strip away repetitive text, redundant labels, decorative emojis, heavy card borders, and loud animations.
  4. Implement a clean, modern Dark Minimalist theme (Apple / Vercel aesthetic) across `app/layouts/admin.vue`, `app/pages/admin/players.vue`, `app/pages/admin/tasks.vue`, and `app/pages/admin/scores.vue`.

---

## 2. Layout & Navigation (`app/layouts/admin.vue`)
- **Nav Items**:
  - `👥 玩家管理` (`/admin/players`)
  - `📋 任務管理` (`/admin/tasks`)
  - `⭐ 積分管理` (`/admin/scores`)
- **Header & Sidebar**:
  - Remove redundant subtitles ("控制面板", "All-Star 管理後台").
  - Clean brand mark with subtle status indicator.
  - Simplify mobile header & bottom navigation bar (3 primary items with badge count on Players tab).
  - Streamline logout and return-to-frontend links.

---

## 3. Page Specifications

### 3.1 Admin Root (`app/pages/admin/index.vue`)
- Replace dashboard contents with instant redirect to `/admin/players`.

### 3.2 Players Management (`app/pages/admin/players.vue`)
- **Header Action Bar**: Unified top bar combining page title, total player count badge, real-time search input, and filter tabs.
- **Filter Tabs**: Clean tab pills: `全部` | `待審核` | `已核准` | `已拒絕` | `已禁用`.
- **Player Table / Cards**:
  - Desktop: Sleek high-density table with clean column dividers.
  - Mobile: Clean minimal cards without unnecessary wrapper borders.
  - Status Indicators: Minimal color-coded status badges with dot indicators (e.g. `● 待審核`).
  - Action Controls: Compact, high-contrast action buttons (`核准`, `拒絕`, `重置`, `禁用`).

### 3.3 Tasks Management (`app/pages/admin/tasks.vue`)
- **Header Action Bar**: Single-row title, total count, search bar, and `+ 新增任務` button.
- **Add Task Form**: Slick collapsible form panel with compact 2-column input grid.
- **Task List**: Clean table/card view showing Title, Description, Type, Points, Status toggle, and Actions (Edit/Delete).

### 3.4 Scores Management (`app/pages/admin/scores.vue`)
- **Header Action Bar**: Single-row title, history count badge, and `+ 發放積分` toggle button.
- **Score Distribution Form**: Compact inline form with player selector, score input, and reason text field.
- **Score History List**: Streamlined chronological transaction log showing Date, Player, Score change, Reason, and Admin operator.

---

## 4. Verification & Testing Criteria
- Nuxt build / typecheck passes without errors.
- Navigation seamlessly switches between Players, Tasks, and Scores pages.
- Accessing `/admin` automatically redirects to `/admin/players`.
- Desktop and Mobile responsive layouts render cleanly without overflow or UI clutter.
