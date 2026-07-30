import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { status, name } = body

  const db = await useDB(event)
  
  const updates = []
  const values = []
  let paramIndex = 1

  if (status !== undefined) {
    updates.push(`status = ?${paramIndex++}`)
    values.push(status)
  }
  if (name !== undefined) {
    updates.push(`name = ?${paramIndex++}`)
    values.push(name)
  }

  if (updates.length === 0) {
    const player = await db.prepare("SELECT * FROM players WHERE id = ?1").bind(id).first()
    return player
  }

  updates.push(`updated_at = datetime('now')`)
  
  values.push(id)

  const query = `UPDATE players SET ${updates.join(', ')} WHERE id = ?${paramIndex} RETURNING *`
  const result = await db.prepare(query).bind(...values).first()
  
  if (!result) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }
  
  return result
})
