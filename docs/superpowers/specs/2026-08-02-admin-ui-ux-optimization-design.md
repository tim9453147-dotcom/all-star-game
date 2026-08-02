# Admin UI/UX Optimization Design Specification

## Goal
Transform the Admin pages (`/admin`, `/admin/players`, `/admin/tasks`, `/admin/scores`) into a zero-friction, intuitive, visually stunning interface with minimal redundant text ("不用過多說明文字", "使用者能夠不用思考，直覺使用").

## Key Requirements & UX Rules
1. **Zero Text Clutter**: Remove all non-essential filler subtitles, explanatory paragraphs, and redundant helper text.
2. **Zero-Friction Intuitive Actions**:
   - **Clickable Dashboard Cards**: Stats cards on `/admin` navigate directly to filtered views (e.g., clicking "待審核玩家" opens `/admin/players?tab=pending`).
   - **Cross-Page Fast-Tracking**: Adding a "+ 積分" button on player cards/rows in `/admin/players` that opens `/admin/scores?player_id=X` with the player pre-selected.
   - **One-Click Approval / Status Toggle**: Immediate visual state toggles for player approval, player status, and task status.
   - **Preset Quick Modifiers**: Quick point buttons (+5, +10, +20, +50) when adding tasks or giving points.
3. **Visual Excellence & Hierarchy**:
   - Modern glassmorphism with HSL tailored color palette.
   - Standardized status badges (Emerald = Active/Pass, Amber = Pending/Score, Rose = Inactive/Reject, Indigo = Task/System).

## Architectural Impact & File Changes
- `app/layouts/admin.vue`: Streamline admin sidebar and navigation header.
- `app/pages/admin/index.vue`: Make dashboard stat cards clickable and remove text fluff.
- `app/pages/admin/players.vue`: Handle `route.query.tab`, add "+ 積分" quick button, streamline actions.
- `app/pages/admin/tasks.vue`: Add quick point presets, fast status toggle, remove text fluff.
- `app/pages/admin/scores.vue`: Handle `route.query.player_id`, auto-open prefilled form, streamline layout.

## Verification
- Test all navigation routes.
- Verify status changes, score awarding, task creation, search filtering, and query parameters.
