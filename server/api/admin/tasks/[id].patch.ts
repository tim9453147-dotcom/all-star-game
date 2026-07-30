import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, points, status } = body

  const db = await useDB(event)
  
  const updates = []
  const values = []
  let paramIndex = 1

  if (name !== undefined) {
    updates.push(`name = ?${paramIndex++}`)
    values.push(name)
  }
  if (points !== undefined) {
    updates.push(`points = ?${paramIndex++}`)
    values.push(points)
  }
  if (status !== undefined) {
    updates.push(`status = ?${paramIndex++}`)
    values.push(status)
  }

  if (updates.length === 0) {
    const task = await db.prepare("SELECT * FROM tasks WHERE id = ?1").bind(id).first()
    return task
  }

  updates.push(`updated_at = datetime('now')`)
  values.push(id)

  const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?${paramIndex} RETURNING *`
  const result = await db.prepare(query).bind(...values).first()
  
  if (!result) {
    throw createError({ statusCode: 404, message: 'Task not found' })
  }
  
  return result
})
