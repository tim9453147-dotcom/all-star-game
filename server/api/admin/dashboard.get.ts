import { requireAdminSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = await useDB(event)
  
  const totalPlayersResult: any = await db.prepare("SELECT COUNT(*) as count FROM players WHERE status = 'active'").first()
  const pendingPlayersResult: any = await db.prepare("SELECT COUNT(*) as count FROM players WHERE status = 'pending'").first()
  const totalScoreRecordsResult: any = await db.prepare("SELECT COUNT(*) as count FROM score_records").first()
  const todayScoreRecordsResult: any = await db.prepare("SELECT COUNT(*) as count FROM score_records WHERE date(created_at) = date('now')").first()
  const todayPointsResult: any = await db.prepare("SELECT SUM(points) as total FROM score_records WHERE date(created_at) = date('now')").first()
  
  const { results: topPlayers } = await db.prepare("SELECT id, player_id, name, total_score FROM players WHERE status = 'active' ORDER BY total_score DESC LIMIT 5").all()
  
  return {
    totalPlayers: totalPlayersResult?.count || 0,
    pendingPlayers: pendingPlayersResult?.count || 0,
    totalScoreRecords: totalScoreRecordsResult?.count || 0,
    todayScoreRecords: todayScoreRecordsResult?.count || 0,
    todayPoints: todayPointsResult?.total || 0,
    topPlayers
  }
})
