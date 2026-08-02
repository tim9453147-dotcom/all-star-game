import { describe, it, expect } from 'bun:test'
import initSqlJs from 'sql.js'
import { useDB } from '../server/utils/db'

describe('Database Schema & Auto-Migration', () => {
  it('should initialize DB with is_deleted column in tasks table', async () => {
    const fakeEvent = { context: {} } as any
    const db = await useDB(fakeEvent)

    // Check table info for tasks
    const tableInfo = await db.prepare("PRAGMA table_info(tasks)").all()
    const columns = tableInfo.results.map((c: any) => c.name)
    expect(columns).toContain('is_deleted')

    // Query tasks table
    const tasks = await db.prepare("SELECT * FROM tasks").all()
    expect(tasks.results.length).toBeGreaterThan(0)
    for (const task of tasks.results as any[]) {
      expect(task.is_deleted).toBeDefined()
      expect(task.is_deleted).toBe(0)
    }
  })

  it('should safely auto-migrate when ALTER TABLE is called repeatedly', async () => {
    const fakeEvent = { context: {} } as any
    const db = await useDB(fakeEvent)

    // Second call should not throw any error
    const db2 = await useDB(fakeEvent)
    const tableInfo = await db2.prepare("PRAGMA table_info(tasks)").all()
    const columns = tableInfo.results.map((c: any) => c.name)
    expect(columns).toContain('is_deleted')
  })
})
