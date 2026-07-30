import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)
  const { player_id, task_id, note } = body

  if (!player_id || !task_id) {
    throw createError({ statusCode: 400, message: 'player_id and task_id are required' })
  }

  const db = await useDB(event)
  
  const task: any = await db.prepare("SELECT points FROM tasks WHERE id = ?1").bind(task_id).first()
  if (!task) {
    throw createError({ statusCode: 404, message: 'Task not found' })
  }
  
  const points = task.points

  const record = await db.prepare(
    "INSERT INTO score_records (player_id, task_id, points, note, created_at) VALUES (?1, ?2, ?3, ?4, datetime('now')) RETURNING *"
  ).bind(player_id, task_id, points, note || null).first()
  
  await db.prepare(
    "UPDATE players SET total_score = total_score + ?1, updated_at = datetime('now') WHERE id = ?2"
  ).bind(points, player_id).run()

  const player: any = await db.prepare("SELECT total_score FROM players WHERE id = ?1").bind(player_id).first()
  
  return {
    ...record,
    player_total_score: player?.total_score
  }
})
