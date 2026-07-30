import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { points, note } = body

  const db = await useDB(event)
  
  const existingRecord: any = await db.prepare("SELECT * FROM score_records WHERE id = ?1").bind(id).first()
  if (!existingRecord) {
    throw createError({ statusCode: 404, message: 'Score record not found' })
  }

  const updates = []
  const values = []
  let paramIndex = 1

  if (points !== undefined) {
    updates.push(`points = ?${paramIndex++}`)
    values.push(points)
  }
  if (note !== undefined) {
    updates.push(`note = ?${paramIndex++}`)
    values.push(note)
  }

  if (updates.length === 0) {
    return existingRecord
  }

  values.push(id)
  
  const query = `UPDATE score_records SET ${updates.join(', ')} WHERE id = ?${paramIndex} RETURNING *`
  const updatedRecord: any = await db.prepare(query).bind(...values).first()

  if (points !== undefined && points !== existingRecord.points) {
    const playerId = existingRecord.player_id
    const sumResult: any = await db.prepare("SELECT SUM(points) as total FROM score_records WHERE player_id = ?1").bind(playerId).first()
    const newTotal = sumResult.total || 0
    await db.prepare("UPDATE players SET total_score = ?1, updated_at = datetime('now') WHERE id = ?2").bind(newTotal, playerId).run()
  }

  return updatedRecord
})
