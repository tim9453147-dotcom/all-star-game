export default defineEventHandler(async (event) => {
  const db = await useDB(event)
  const { results } = await db.prepare("SELECT * FROM rewards WHERE status = 'active' ORDER BY points_required ASC").all()
  return results
})
