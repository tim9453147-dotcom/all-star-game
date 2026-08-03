import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const query = getQuery(event)
  const playerId = query.player_id

  const db = await useDB(event)
  
  let sql = `
<<<<<<< Updated upstream
    SELECT s.*, p.name as player_name, p.player_id as player_game_id, t.name as task_name 
=======
    SELECT s.*, p.name as player_name, p.avatar as player_avatar, t.name as task_name 
>>>>>>> Stashed changes
    FROM score_records s 
    LEFT JOIN players p ON s.player_id = p.id 
    LEFT JOIN tasks t ON s.task_id = t.id
  `
  
  let stmt = undefined;
  
  if (playerId) {
    sql += " WHERE s.player_id = ?1 ORDER BY s.created_at DESC"
    stmt = db.prepare(sql).bind(playerId)
  } else {
    sql += " ORDER BY s.created_at DESC"
    stmt = db.prepare(sql)
  }

  const { results } = await stmt.all()
  return results
})
