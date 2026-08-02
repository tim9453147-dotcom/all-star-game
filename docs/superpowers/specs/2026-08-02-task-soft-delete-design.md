# Task Management - Task Soft Delete Design

## Overview
Add a soft delete feature to the Task Management interface (`/admin/tasks`). When a task is deleted by an admin, it is soft-deleted (`is_deleted = 1`) in the database so that historic score records (`score_records`) and players' total scores remain completely intact and display the original task name in history logs.

## Requirements & Scope
1. **Soft Delete Storage**: Add `is_deleted INTEGER DEFAULT 0` column to `tasks` table.
2. **API Routes**:
   - `DELETE /api/admin/tasks/[id]`: Soft deletes a task by setting `is_deleted = 1`.
   - `GET /api/admin/tasks`: Filter out deleted tasks (`WHERE is_deleted = 0 OR is_deleted IS NULL`).
3. **Admin UI (`app/pages/admin/tasks.vue`)**:
   - Add a "刪除" (Delete) button to task cards (mobile) and table rows (desktop).
   - Add a confirm modal before deletion to prevent accidental clicks.
   - Show notification message "任務已成功刪除！" upon deletion.
4. **Historical Score Integrity**:
   - `score_records` querying `LEFT JOIN tasks` continues to display task names even for soft-deleted tasks.
   - Player total scores (`total_score`) are untouched.

## Component & API Specifications

### 1. Database Schema (`server/utils/db.ts`)
- Ensure `tasks` table includes `is_deleted INTEGER DEFAULT 0`.
- Auto-migrate column `is_deleted` using SQLite `ALTER TABLE tasks ADD COLUMN is_deleted INTEGER DEFAULT 0;` if missing.

### 2. API Endpoints
- `DELETE /api/admin/tasks/[id].delete.ts`:
  - Require admin session (`requireAdminSession(event)`).
  - Update `tasks` setting `is_deleted = 1` and `updated_at = datetime('now')`.
  - Return `{ success: true, id }`.
- `GET /api/admin/tasks/index.get.ts`:
  - Execute `SELECT * FROM tasks WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC`.

### 3. Frontend UI (`app/pages/admin/tasks.vue`)
- Add `taskToDelete` state for confirmation modal.
- Render Delete button in mobile card view and desktop table view.
- Show confirmation modal: "確定要刪除任務『{name}』嗎？"
- On confirm, call `$fetch('/api/admin/tasks/' + id, { method: 'DELETE' })` and call `refresh()`.

## Verification Strategy
- Run unit/e2e or manual dev server check (`bun run dev`).
- Test creating a task, assigning score to a player, soft deleting the task, and verifying:
  1. Task disappears from Task Management list.
  2. Player total score and score history records still retain the original score and task name.
