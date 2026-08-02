import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Invalid player ID' })
  }

  const db = await useDB(event)

  // Verify player exists
  const existingPlayer = await db.prepare("SELECT id FROM players WHERE id = ?1").bind(id).first()
  if (!existingPlayer) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Delete score records for this player first
  await db.prepare("DELETE FROM score_records WHERE player_id = ?1").bind(id).run()

  // Delete player
  await db.prepare("DELETE FROM players WHERE id = ?1").bind(id).run()

  return { success: true, message: 'Player deleted successfully' }
})
