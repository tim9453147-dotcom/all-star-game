export default defineEventHandler(async (event) => {
  const db = await useDB(event)
  const { results } = await db.prepare("SELECT id, player_id, player_id as name, total_score, status FROM players WHERE status = 'active' ORDER BY total_score DESC").all()
  return results
})
