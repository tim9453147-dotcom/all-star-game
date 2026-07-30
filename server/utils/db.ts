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
            return { results: queryAll(sqliteDb, query, params) }
          } catch (e: any) {
            throw createError({ statusCode: 500, message: e.message })
          }
        },
        async first() {
          try {
            return queryFirst(sqliteDb, query, params)
          } catch (e: any) {
            throw createError({ statusCode: 500, message: e.message })
          }
        },
        async run() {
          try {
            sqliteDb.run(query, params)
            persistDb()
            return { success: true }
          } catch (e: any) {
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

/**
 * Returns a D1-compatible database interface.
 * - Production (Cloudflare Workers): uses D1 binding
 * - Development (bun run dev): uses sql.js with D1 wrapper
 */
export async function useDB(event: H3Event) {
  // Production: Cloudflare D1 binding
  const cloudflareEnv = (event.context as any).cloudflare?.env
  if (cloudflareEnv?.DB) {
    return cloudflareEnv.DB
  }

  // Development: sql.js wrapped as D1
  const sqlite = await getDevDatabase()
  return wrapSqlJsAsD1(sqlite)
}
