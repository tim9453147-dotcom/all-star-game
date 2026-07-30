import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)
  const { points_required, name } = body

  if (points_required === undefined || !name) {
    throw createError({ statusCode: 400, message: 'points_required and name are required' })
  }

  const db = await useDB(event)
  const result = await db.prepare(
    "INSERT INTO rewards (points_required, name, status, created_at, updated_at) VALUES (?1, ?2, 'active', datetime('now'), datetime('now')) RETURNING *"
  ).bind(points_required, name).first()

  return result
})
