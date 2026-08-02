# Delete Player Feature Design

## Overview
Add functionality to delete players from the system within the admin panel (`/admin/players`). The feature includes back-end cleanups (deleting associated score records and the player record) and front-end UX confirmation (modal prompt before deletion).

## User Experience (UX) & Interface

### Player Management Page (`app/pages/admin/players.vue`)
- **Delete Button**:
  - Added to the action button area of both mobile card view and desktop table view.
  - Styled with a subtle rose/red color scheme (`bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25`) to indicate a destructive action.
- **Confirmation Modal**:
  - Modal pops up when clicking "刪除" button.
  - Displays:
    - Title: `⚠️ 確定要刪除玩家？`
    - Body text: `確定要刪除「[name] ([player_id])」嗎？此動作將同時刪除該玩家的所有積分紀錄，且無法復原。`
    - Action buttons: "取消" (Cancel, surface gray) and "確認刪除" (Confirm Delete, solid danger red).
- **Feedback & Refresh**:
  - Shows success/error toast message upon completion.
  - Automatically triggers `refresh()` to update list counts and tabs.

## API Endpoint Design

### `DELETE /api/admin/players/[id]`
- **Authentication**: Protected with `requireAdminSession(event)`.
- **Database Operations**:
  1. Delete associated score records: `DELETE FROM score_records WHERE player_id = ?`
  2. Delete player record: `DELETE FROM players WHERE id = ?`
- **Response**: Returns `{ success: true, message: 'Player deleted successfully' }` or `404 Not Found` if player doesn't exist.

## Testing & Verification Plan
1. Admin login verification.
2. Select a player and click "刪除".
3. Verify confirmation modal appears with correct player details.
4. Click "取消" -> modal closes without deletion.
5. Click "確認刪除" -> player and associated score records deleted from DB, success toast displayed, list updated.
