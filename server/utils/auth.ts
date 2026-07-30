import { useSession, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export async function requireAdminSession(event: any) {
  const config = useRuntimeConfig()
  const session = await useSession(event, { password: config.sessionSecret })
  
  if (session.data.isAdmin !== true) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  
  return session
}
