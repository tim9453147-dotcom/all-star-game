# 積分管理頁面視覺與互動優化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重構並優化「積分管理」頁面 (`app/pages/admin/scores.vue`) 的 UI 與 UX，移除冗餘說明與重複標題，簡化發放表單，並升級為 Glassmorphic 極致視覺介面。

**Architecture:** 單頁 Nuxt 3 Vue 畫面重構，優化 template 結構與 CSS 樣式，簡化 Vue reactive state 與 computed 屬性的畫面渲染，確保完全相容現有的 `/api/admin/scores` 與 `/api/admin/players` API。

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Tailwind CSS, TypeScript.

## Global Constraints
- 不改動 `/api/admin/scores` 或 `/api/admin/players` 的底層 API 介面與資料結構。
- 保持原本完整功能（發放積分、單項紀錄編輯、關鍵字搜尋與玩家篩選）。
- 遵從深色主題 (Glassmorphic dark design style)，主要強調點數與 Amber 亮黃配色。

---

### Task 1: 重構發放表單 (Add Score Form) 並移除冗餘元件

**Files:**
- Modify: `app/pages/admin/scores.vue`

**Interfaces:**
- Consumes: `activePlayers`, `activeTasks`, `scoreForm`
- Produces: 精簡後無重複標題、整合點數膠囊標籤的響應式表單

- [ ] **Step 1: 移除重複標題與獨立積分加總外框**

在 `app/pages/admin/scores.vue` 的 `showForm` 區塊中：
- 移除 `<h3 class="text-xs sm:text-sm font-bold text-amber-300">發放積分</h3>` 標題列。
- 移除 `<div class="shrink-0 text-center px-3 py-1.5 rounded-lg bg-surface-900/90 border border-surface-700 min-w-[90px]">` 的「積分加總」獨立外框。
- 將選取任務時獲得的積分改為與按鈕併排顯示的動態膠囊標籤 `<span v-if="selectedTaskPoints > 0" class="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">+{{ selectedTaskPoints }} 分</span>`。

- [ ] **Step 2: 整理表單欄位與 Placeholder 說明**

- 將玩家選單與任務選單改為乾淨無字數繁雜的選項標題（例如：`請選擇玩家` 與 `請選擇任務`）。
- 調整表單為響應式網格（桌面版 3 欄 / 行動版 單欄），將選單、備註輸入框、點數膠囊與「確認發放」按鈕緊湊排版。

- [ ] **Step 3: 驗證表單顯示**

測試點擊頂部 `+ 發放積分` / `隱藏表單` 按鈕，確認表單展開與收合平滑，選取任務時點數膠囊正確更新。

- [ ] **Step 4: Commit**

```bash
git add app/pages/admin/scores.vue
git commit -m "refactor(admin/scores): streamline score issuance form and remove redundant text"
```

---

### Task 2: 重構搜尋篩選列與紀錄列表 (Filter Bar & Score Records Table)

**Files:**
- Modify: `app/pages/admin/scores.vue`

**Interfaces:**
- Consumes: `filteredRecords`, `searchRecordQuery`, `filterPlayerId`
- Produces: 整合式工具列、升級版的桌面版紀錄表格與行動版紀錄卡片

- [ ] **Step 1: 重構搜尋與篩選工具列 (Filter Toolbar)**

- 將「玩家篩選下拉選單」與「搜尋紀錄...」輸入框整合在同一個面板中。
- 當 `searchRecordQuery` 或 `filterPlayerId` 有值時，顯示一鍵清除篩選按鈕 (`重置篩選`) 及當前比對筆數。

- [ ] **Step 2: 升級桌面版表格與行動版卡片**

- **點數顯示**：將 `+X 分` 樣式升級為 Amber 高亮膠囊風格 (`bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold`)。
- **玩家欄位**：新增玩家文字頭像 Chip，精緻顯示遊戲 ID 與本名。
- **無備註處理**：移除文字 `無備註`，改為極簡灰字 `—`。
- **紀錄空狀態**：使用圖示與乾淨提示語「無符合條件的積分紀錄」。

- [ ] **Step 3: 優化行內編輯狀態 (Inline Record Edit)**

- 在表格列或卡片點擊「編輯」時，優化數字輸入與備註輸入框樣式，確保按鈕邊框與 focus 環視覺統一。

- [ ] **Step 4: Commit**

```bash
git add app/pages/admin/scores.vue
git commit -m "style(admin/scores): modernize score records table, mobile cards, and filter bar"
```

---

### Task 3: 專案構建與全頁面驗證 (Build & Final Verification)

**Files:**
- Test/Verify: `app/pages/admin/scores.vue`

- [ ] **Step 1: 執行 Nuxt Build 檢查**

```bash
npm run build
```
確認 TypeScript 型別與 Vue 模板無任何編譯錯誤。

- [ ] **Step 2: 全功能與 UI 檢驗**

確認新增積分發放、關鍵字搜尋、玩家篩選、行內編輯與 RWD 介面皆符合無冗餘、極致視覺設計標準。

- [ ] **Step 3: Final Commit**

```bash
git commit --allow-empty -m "chore(admin/scores): complete points page UI optimization"
```
