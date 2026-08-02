# Simplified Map Node Player Details Design

## Overview
Simplify the node/tile click behavior on the map board (`WindingBoard.vue`) so that clicking any node displays a minimal modal listing only the `player_id`s of all players located on that node. All other statistics (total score, lap count, progress bar, rank tags, etc.) are removed for maximum simplicity.

## Changes Required

### 1. `app/components/PlayerDetailModal.vue` (or replacement)
- Update props to accept `tileNum: number | null` and `players: Player[]`.
- Display header: `格子 #${tileNum}`.
- Display a simple list of `player.player_id` for all players on this tile.
- If no players are on this tile, display a friendly empty message (e.g. `此格子目前無玩家`).
- Provide a single "關閉" (Close) button and background backdrop click to dismiss.
- Remove total score, lap count, progress bar, leader crown badge, and status info.

### 2. `app/components/WindingBoard.vue`
- Update `handleTileClick(num: number)` to pass all players on the clicked tile (`cellPlayers(num)`) and the tile number `num`, rather than only selecting `playersOnCell[0]`.
- Update emits to emit `(e: 'select-tile', tileNum: number, players: Player[])`.

### 3. `app/pages/index.vue`
- Update reactive state to track `selectedTileNum` and `selectedTilePlayers`.
- Handle `@select-tile` event from `WindingBoard`.
- Pass `tileNum` and `players` into `PlayerDetailModal`.

## Verification Plan
- Verify page renders correctly and clicking any tile opens the minimal modal showing only player IDs.
- Verify clicking tiles with multiple players lists all player IDs on that tile.
- Verify clicking empty tiles shows the empty message cleanly.
- Verify build (`npm run build` or Nuxt typecheck) passes without errors.
