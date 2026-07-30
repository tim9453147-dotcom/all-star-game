import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { points_required, name, status } = body

  const db = await useDB(event)
  
  const updates = []
  const values = []
  let paramIndex = 1

  if (points_required !== undefined) {
    updates.push(`points_required = ?${paramIndex++}`)
    values.push(points_required)
  }
  if (name !== undefined) {
    updates.push(`name = ?${paramIndex++}`)
    values.push(name)
  }
  if (status !== undefined) {
    updates.push(`status = ?${paramIndex++}`)
    values.push(status)
  }

  if (updates.length === 0) {
    const reward = await db.prepare("SELECT * FROM rewards WHERE id = ?1").bind(id).first()
    return reward
  }

  updates.push(`updated_at = datetime('now')`)
  values.push(id)

  const query = `UPDATE rewards SET ${updates.join(', ')} WHERE id = ?${paramIndex} RETURNING *`
  const result = await db.prepare(query).bind(...values).first()
  
  if (!result) {
    throw createError({ statusCode: 404, message: 'Reward not found' })
  }
  
  return result
})
