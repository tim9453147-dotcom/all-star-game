# All-Star (Score Monopoly) 🎲

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.x-FBF0DF?logo=bun&logoColor=black)](https://bun.sh/)

「All-Star」是一個結合任務完成、積分累積與大富翁棋盤機制的互動遊戲系統。玩家透過完成各項指定的任務累積點數，點數直接決定玩家在環狀大富翁地圖上的棋子位置，並在達到特定里程碑時解鎖獎勵！

---

## 🛠️ 技術棧 (Tech Stack)

| 類別 | 技術 | 說明 |
|---|---|---|
| **前端框架** | [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/) | 全棧 SSR 框架 |
| **程式語言** | [TypeScript](https://www.typescriptlang.org/) | 全端強型別 |
| **UI 樣式** | [TailwindCSS](https://tailwindcss.com/) | 實用優先 CSS |
| **狀態管理** | [Pinia](https://pinia.vuejs.org/) | 輕量級狀態管理 |
| **後端 API** | Nuxt Server API (Nitro) | 高效能後端引擎 |
| **資料庫** | [sql.js](https://sql-js.github.io/sql.js/) (Dev) / [Cloudflare D1](https://developers.cloudflare.com/d1/) (Prod) | SQLite 開發 / D1 生產 |
| **部署平台** | [Cloudflare Pages](https://pages.cloudflare.com/) | 邊緣運算部署 |
| **執行環境** | [Bun](https://bun.sh/) | 極速 JS/TS 執行環境 |

---

## 🚀 開發快速啟動 (Quick Start)

```bash
# 1. Clone 並安裝依賴
git clone <repo-url>
cd all-star-game
bun install

# 2. 設定環境變數
cp .env.example .env
# 編輯 .env 填入管理員帳密與 Session 密鑰

# 3. 啟動開發伺服器
bun run dev
# 瀏覽器訪問 http://localhost:3000
```

> **📌 開發提醒：**
> - **資料庫自動建置**：首次啟動會自動建立 SQLite 資料庫（存放在 `.data/dev.db`）。
> - **自動 Migration**：第一次啟動自動執行資料表建立與預設資料填充。
> - **預設管理員帳號**：`admin` / `admin123`（可在 `.env` 中修改）。

---

## 📁 專案結構 (Project Structure)

```text
all-star-game/
├── app/
│   ├── composables/    # Vue Composables
│   ├── layouts/        # 頁面版型 (default, admin)
│   ├── middleware/     # 路由中間件 (admin 認證)
│   ├── pages/          # 應用程式頁面
│   └── stores/         # Pinia 狀態管理
├── server/
│   ├── api/           # Nitro API 路由
│   ├── database/      # Migration SQL
│   └── utils/         # 後端工具 (db.ts, auth.ts)
├── nuxt.config.ts     # Nuxt 配置
├── wrangler.toml      # Cloudflare 部署配置
├── .env.example       # 環境變數範本
└── package.json       # 依賴與腳本
```

---

## 🎮 遊戲規則 (Game Rules)

- **積分累積**：完成任務累積積分，積分只增不減。
- **棋盤位置**：100 格環狀地圖，`位置 = 總積分 % 100`。
- **直前不退**：無骰子，積分直接推進，無後退機制。
- **里程碑獎勵**：達到 100、200 分等里程碑解鎖獎勵。

### 預設任務與積分

| 任務 | 積分 |
|------|-----:|
| 開發 | 1 |
| 個人聚會 | 1 |
| 群星活動 | 2 |
| 家庭聚會 | 3 |
| 教室課程 | 5 |
| 推薦 | 7 |
| 長客 | 10 |

### 預設獎勵

| 積分門檻 | 獎勵 |
|----------:|------|
| 100 | 飲料一杯 |
| 200 | 商場一餐 |

---

## 👥 角色與權限

| 角色 | 權限 |
|---|---|
| **一般使用者** | 檢視棋盤與玩家位置、瀏覽獎勵、申請加入遊戲 |
| **管理員** | 審核玩家、管理任務、新增積分、管理獎勵 |

---

## ☁️ 部署到 Cloudflare Pages

### 完整 CLI 指令部署步驟

```bash
# 1. 登入 Cloudflare 帳號
bunx wrangler login

# 2. 建立 Cloudflare D1 資料庫
bunx wrangler d1 create all-star-game-db
# 複製輸出終端機中的 database_id 並貼至 wrangler.toml 的 database_id 欄位

# 3. 執行資料庫 Migration（建立遠端 D1 資料表與預設資料）
bunx wrangler d1 execute all-star-game-db --remote --file=server/database/migrations/0001_initial.sql

# 4. 下指令設定管理員帳號密碼與 Session 密鑰 (Secrets)
# 方式 A：單獨下指令設定（會提示輸入密碼）
bunx wrangler pages secret put NUXT_ADMIN_USERNAME --project-name all-star-game
bunx wrangler pages secret put NUXT_ADMIN_PASSWORD --project-name all-star-game
bunx wrangler pages secret put NUXT_SESSION_SECRET --project-name all-star-game

# 方式 B：也可透過 .env 檔案批次匯入環境變數
# bunx wrangler pages secret bulk .env --project-name all-star-game

# 5. 建置專案與部署至 Cloudflare Pages
NITRO_PRESET=cloudflare-pages bun run build
bunx wrangler pages deploy .output/public --project-name all-star-game
```

> **💡 提示：** 
> - 除了透過 CLI 之外，亦可至 Cloudflare Dashboard > Pages > 你的專案 > **Settings** > **Environment variables** 頁面設定上述變數。
> - `NUXT_SESSION_SECRET` 請填寫長度至少 32 字元以上的隨機字串以確保 Session 安全。

---

## 🔌 API 參考

### 公開 API

| 方法 | Endpoint | 說明 |
|---|---|---|
| `GET` | `/api/players` | 取得所有啟用玩家（依積分排序） |
| `GET` | `/api/rewards` | 取得獎勵列表 |
| `POST` | `/api/players/apply` | 申請加入遊戲 |

### 管理員 API

| 方法 | Endpoint | 說明 |
|---|---|---|
| `POST` | `/api/admin/login` | 管理員登入 |
| `POST` | `/api/admin/logout` | 管理員登出 |
| `GET` | `/api/admin/session` | 檢查登入狀態 |
| `GET` | `/api/admin/dashboard` | Dashboard 統計 |
| `GET` | `/api/admin/players` | 所有玩家列表 |
| `PATCH` | `/api/admin/players/:id` | 更新玩家狀態 |
| `GET/POST` | `/api/admin/tasks` | 任務列表 / 新增任務 |
| `PATCH` | `/api/admin/tasks/:id` | 修改任務 |
| `GET/POST` | `/api/admin/scores` | 積分記錄 / 新增積分 |
| `PATCH` | `/api/admin/scores/:id` | 修改積分記錄 |
| `GET/POST` | `/api/admin/rewards` | 獎勵列表 / 新增獎勵 |
| `PATCH` | `/api/admin/rewards/:id` | 修改獎勵 |

---

## ⚙️ 環境變數

| 變數名稱 | 說明 | 預設值 |
|---|---|---|
| `ADMIN_USERNAME` | 管理員帳號 | `admin` |
| `ADMIN_PASSWORD` | 管理員密碼 | `admin123` |
| `SESSION_SECRET` | Session 密鑰（≥32 字元） | *(內建開發用)* |

> 部署至 Cloudflare Pages 時，變數名稱加 `NUXT_` 前綴（如 `NUXT_ADMIN_USERNAME`）。

---

## 📄 License

MIT
