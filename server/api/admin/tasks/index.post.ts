import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)
  const { name, points } = body

  if (!name || points === undefined) {
    throw createError({ statusCode: 400, message: 'name and points are required' })
  }

  const db = await useDB(event)
  const result = await db.prepare(
    "INSERT INTO tasks (name, points, status, created_at, updated_at) VALUES (?1, ?2, 'active', datetime('now'), datetime('now')) RETURNING *"
  ).bind(name, points).first()

  return result
})
