export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { player_id, name } = body

  if (!player_id || !name) {
    throw createError({ statusCode: 400, message: 'player_id and name are required' })
  }

  const db = await useDB(event)
  
  try {
    const result = await db.prepare(
      "INSERT INTO players (player_id, name, status, created_at, updated_at) VALUES (?1, ?2, 'pending', datetime('now'), datetime('now')) RETURNING *"
    ).bind(player_id, name).first()
    
    return result
  } catch (e: any) {
    if (e.message && e.message.includes('UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Player ID already exists' })
    }
    throw createError({ statusCode: 500, message: 'Database error' })
  }
})
