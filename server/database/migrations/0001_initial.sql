-- 玩家
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'inactive')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 任務
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  is_deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 積分紀錄
CREATE TABLE IF NOT EXISTS score_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  points INTEGER NOT NULL,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- 預設任務（僅在表為空時插入）
INSERT INTO tasks (name, points) SELECT '開發', 1 WHERE NOT EXISTS (SELECT 1 FROM tasks);
INSERT INTO tasks (name, points) SELECT '個人聚會', 1 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '個人聚會');
INSERT INTO tasks (name, points) SELECT '群星活動', 2 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '群星活動');
INSERT INTO tasks (name, points) SELECT '家庭聚會', 3 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '家庭聚會');
INSERT INTO tasks (name, points) SELECT '教室課程', 5 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '教室課程');
INSERT INTO tasks (name, points) SELECT '推薦', 7 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '推薦');
INSERT INTO tasks (name, points) SELECT '長客', 10 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '長客');
