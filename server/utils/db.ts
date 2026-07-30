import type { H3Event } from 'h3'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js'

let _db: SqlJsDatabase | null = null
let _dbPath: string = ''

/**
 * Get or create local SQLite database for development.
 * Uses sql.js (WASM-based SQLite, works in any JS runtime).
 */
async function getDevDatabase(): Promise<SqlJsDatabase> {
  if (_db) return _db

  const SQL = await initSqlJs()

  const dbDir = join(process.cwd(), '.data')
  if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true })

  _dbPath = join(dbDir, 'dev.db')

  // Load existing database or create new one
  if (existsSync(_dbPath)) {
    const buffer = readFileSync(_dbPath)
    _db = new SQL.Database(buffer)
  } else {
    _db = new SQL.Database()
  }

  // Run initial migration
  const migrationFile = join(process.cwd(), 'server/database/migrations/0001_initial.sql')
  if (existsSync(migrationFile)) {
    const sql = readFileSync(migrationFile, 'utf-8')
    try {
      _db.exec(sql)
      persistDb()
    } catch (e: any) {
      if (!e.message?.includes('already exists') && !e.message?.includes('UNIQUE constraint')) {
        console.warn('Migration warning:', e.message)
      }
    }
  }

  return _db
}

/** Persist sql.js in-memory database to disk */
function persistDb() {
  if (_db && _dbPath) {
    const data = _db.export()
    writeFileSync(_dbPath, Buffer.from(data))
  }
}

/** Helper: execute a query and return all result rows as objects */
function queryAll(db: SqlJsDatabase, query: string, params: any[]): any[] {
  const stmt = db.prepare(query)
  if (params.length > 0) stmt.bind(params)
  const results: any[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

/** Helper: execute a query and return the first result row as object or null */
function queryFirst(db: SqlJsDatabase, query: string, params: any[]): any | null {
  const stmt = db.prepare(query)
  if (params.length > 0) stmt.bind(params)
  let result = null
  if (stmt.step()) {
    result = stmt.getAsObject()
  }
  stmt.free()
  return result
}

function isMutation(sql: string): boolean {
  const s = sql.trim().toUpperCase()
  return s.startsWith('INSERT') || s.startsWith('UPDATE') || s.startsWith('DELETE') || s.startsWith('REPLACE')
}

/**
 * Wraps sql.js database with a Cloudflare D1-compatible async interface.
 *
 * D1 API patterns supported:
 *   db.prepare(sql).all()
 *   db.prepare(sql).first()
 *   db.prepare(sql).run()
 *   db.prepare(sql).bind(...params).all()
 *   db.prepare(sql).bind(...params).first()
 *   db.prepare(sql).bind(...params).run()
 */
function wrapSqlJsAsD1(sqliteDb: SqlJsDatabase) {
  return {
    prepare(query: string) {
      const makeExecutor = (params: any[]) => ({
        async all() {
          try {
            const results = queryAll(sqliteDb, query, params)
            if (isMutation(query)) persistDb()
            return { results }
          } catch (e: any) {
            if (e.statusCode) throw e
            throw createError({ statusCode: 500, message: e.message })
          }
        },
        async first() {
          try {
            const result = queryFirst(sqliteDb, query, params)
            if (isMutation(query)) persistDb()
            return result
          } catch (e: any) {
            if (e.statusCode) throw e
            throw createError({ statusCode: 500, message: e.message })
          }
        },
        async run() {
          try {
            sqliteDb.run(query, params)
            persistDb()
            return { success: true }
          } catch (e: any) {
            if (e.statusCode) throw e
            throw createError({ statusCode: 500, message: e.message })
          }
        },
      })

      // Support both direct calls (no bind) and chained bind calls
      return {
        ...makeExecutor([]),
        bind(...params: any[]) {
          return makeExecutor(params)
        },
      }
    },
  }
}

const INITIAL_SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    total_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'inactive')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );`,
  `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    points INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );`,
  `CREATE TABLE IF NOT EXISTS score_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
  );`,
  `INSERT INTO tasks (name, points) SELECT '開發', 1 WHERE NOT EXISTS (SELECT 1 FROM tasks);`,
  `INSERT INTO tasks (name, points) SELECT '個人聚會', 1 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '個人聚會');`,
  `INSERT INTO tasks (name, points) SELECT '群星活動', 2 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '群星活動');`,
  `INSERT INTO tasks (name, points) SELECT '家庭聚會', 3 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '家庭聚會');`,
  `INSERT INTO tasks (name, points) SELECT '教室課程', 5 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '教室課程');`,
  `INSERT INTO tasks (name, points) SELECT '推薦', 7 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '推薦');`,
  `INSERT INTO tasks (name, points) SELECT '長客', 10 WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE name = '長客');`
]

let _d1InitPromise: Promise<void> | null = null

async function ensureD1Tables(db: any) {
  if (!_d1InitPromise) {
    _d1InitPromise = (async () => {
      try {
        const check = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='players'").first()
        if (!check) {
          if (db.batch) {
            await db.batch(INITIAL_SCHEMA_STATEMENTS.map((stmt: string) => db.prepare(stmt)))
          } else {
            for (const stmt of INITIAL_SCHEMA_STATEMENTS) {
              await db.prepare(stmt).run()
            }
          }
        }
      } catch (e: any) {
        console.warn('D1 auto table initialization warning:', e?.message || e)
      }
    })()
  }
  await _d1InitPromise
}

/**
 * Returns a D1-compatible database interface.
 * - Production (Cloudflare Workers): uses D1 binding
 * - Development (bun run dev): uses sql.js with D1 wrapper
 */
export async function useDB(event: H3Event) {
  // Production / Local Wrangler: Cloudflare D1 binding
  const cloudflareEnv = (event.context as any).cloudflare?.env
  if (cloudflareEnv?.DB) {
    await ensureD1Tables(cloudflareEnv.DB)
    return cloudflareEnv.DB
  }

  // Development: sql.js wrapped as D1
  const sqlite = await getDevDatabase()
  return wrapSqlJsAsD1(sqlite)
}
