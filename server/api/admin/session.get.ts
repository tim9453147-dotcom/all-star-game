import { useSession } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await useSession(event, { password: config.sessionSecret })
  
  if (session.data.isAdmin === true) {
    return { isAdmin: true }
  }
  
  return { isAdmin: false }
})
