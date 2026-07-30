import { useSession } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await useSession(event, { password: config.sessionSecret })
  await session.clear()
  return { success: true }
})
