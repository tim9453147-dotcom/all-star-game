import { requireAdminSession } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = await useDB(event)
  const { results } = await db.prepare("SELECT * FROM tasks WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC").all()
  return results
})
