import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'Task ID is required' })
  }

  const db = await useDB(event)

  const result = await db.prepare(
    "UPDATE tasks SET is_deleted = 1, updated_at = datetime('now') WHERE id = ?1 RETURNING *"
  ).bind(id).first()

  if (!result) {
    throw createError({ statusCode: 404, message: 'Task not found' })
  }

  return { success: true, id, message: 'Task deleted successfully' }
})
