import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const query = getQuery(event)
  const playerId = query.player_id

  const db = await useDB(event)
  
  let sql = `
    SELECT s.*, p.name as player_name, t.name as task_name 
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
