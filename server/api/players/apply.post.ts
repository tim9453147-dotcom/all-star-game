export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { player_id, name, avatar } = body || {}

  const pid = typeof player_id === 'string' ? player_id.trim() : ''
  const pName = typeof name === 'string' ? name.trim() : ''
  const pAvatar = typeof avatar === 'string' && avatar.trim().length > 0 && avatar.trim().length <= 100 ? avatar.trim() : 'char-1'

  if (!pid || !pName) {
    throw createError({ statusCode: 400, message: 'player_id and name are required' })
  }

  const db = await useDB(event)
  
  try {
    const result = await db.prepare(
      "INSERT INTO players (player_id, name, avatar, status, created_at, updated_at) VALUES (?1, ?2, ?3, 'pending', datetime('now'), datetime('now')) RETURNING *"
    ).bind(pid, pName, pAvatar).first()
    
    return result
  } catch (e: any) {
    console.error('[API /api/players/apply Error]:', e)

    const msg = e?.message || e?.statusMessage || String(e || '')
    if (/unique/i.test(msg)) {
      throw createError({ statusCode: 409, message: 'Player ID already exists' })
    }

    if (e?.statusCode && e?.statusCode !== 500) {
      throw e
    }

    throw createError({
      statusCode: e?.statusCode || 500,
      message: e?.message || 'Database error',
    })
  }
})
