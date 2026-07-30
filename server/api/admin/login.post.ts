import { useSession, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body
  const config = useRuntimeConfig()

  if (username === config.adminUsername && password === config.adminPassword) {
    const session = await useSession(event, { password: config.sessionSecret })
    await session.update({ isAdmin: true })
    return { success: true }
  }

  throw createError({ statusCode: 401, message: 'Invalid credentials' })
})
