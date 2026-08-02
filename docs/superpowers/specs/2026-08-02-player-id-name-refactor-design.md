# Design Spec: Player ID vs Real Name Terminology & UI Refactor

## Summary
Correct the concept and UI representation of Player ID vs. Real Name (`name`) across the All-Star Game application.
- **Game ID (`player_id`)**: The player's in-game handle/nickname displayed on the game board and leaderboard.
- **Real Name (`name`)**: The player's real-life full name (本名) used only by admins for identity verification.
- **UI Principle**: Keep UI concise without excessive explanatory text.

## API Changes
1. `server/api/players.get.ts`:
   - Select `id, player_id, name, total_score, status`.
2. `server/api/admin/scores/index.get.ts`:
   - Include `p.player_id as player_game_id` along with `p.name as player_name`.

## Component & Page Changes
1. `app/components/JoinUsModal.vue` & `app/pages/apply.vue`:
   - Field 1 Label: `遊戲 ID` | Placeholder: `輸入遊戲 ID`
   - Field 2 Label: `姓名` | Placeholder: `輸入本名`
   - Subtext: `🔒 姓名僅供管理員核對身分`
2. `app/pages/admin/players.vue`:
   - Card Avatar: `player.player_id.charAt(0)`
   - Card Main Header: `player.player_id` (Game ID)
   - Card Subtitle: `(本名: {{ player.name }})`
   - Table Columns: `遊戲 ID`, `姓名`, `總積分`, `狀態`, `加入時間`, `操作`
   - Search Placeholder: `搜尋姓名或 ID...`
3. `app/pages/admin/scores.vue`:
   - Select Player Options: `{{ p.player_id }} ({{ p.name }}) — {{ p.total_score }} 分`
   - Record Filter Options: `{{ p.player_id }} ({{ p.name }})`
   - Score Records Display: Render `record.player_game_id` as primary player ID with `record.player_name` in parenthetical/subtext.
