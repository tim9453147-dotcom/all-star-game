# Spec Design: Anonymous Player ID in Game UI

## Overview
This design updates the All-Star game application so that public game interfaces display player IDs instead of real names to maintain anonymity. Real names are collected during registration and visible only to administrators in the admin panel.

## Requirements & Scope

### 1. Public API Anonymization (`/api/players`)
- Update `server/api/players/index.get.ts` (or relevant public player API endpoint) to sanitize player objects sent to unauthenticated/public clients.
- In the public endpoint response, set `name` to equal `player_id` or omit the real name from public payload, preventing real names from leaking in network traffic via browser Developer Tools.

### 2. Public Game UI Components
Update the following components to replace any references to `player.name` with `player.player_id`:
- `app/components/WindingBoard.vue`
- `app/components/HexBoard.vue`
- `app/components/CircuitBoard.vue`
- `app/components/MatrixBoard.vue`
- `app/components/RingBoard.vue`
- `app/components/SpiralBoard.vue`
- `app/components/PlayerDetailModal.vue`
- `app/pages/index.vue`

Avatar initials/letters should be derived from `player.player_id.charAt(0).toUpperCase()` instead of `player.name.charAt(0)`.

### 3. Registration Forms (`apply.vue`, `JoinUsModal.vue`)
- Retain both "Player ID" (`player_id`) and "Name" (`name`) input fields.
- Add clear note/helper text informing users that "Name" is for administrator verification only and will not be displayed on public game screens.

### 4. Admin Management (`/admin/*`)
- Admin endpoints (`/api/admin/*`) and pages (`/admin/players.vue`, `/admin/scores.vue`, etc.) will continue to display both `player_id` and real `name` for player identification and score management.

## Verification Strategy
- Inspect public API `/api/players` response to confirm `name` is equal to `player_id` or omitted.
- Inspect all board components and modal in browser to confirm only `player_id` is rendered.
- Check Admin page to ensure full name and ID remain accessible to admins.
