import { getDefaultLoginRedirect } from '@/routes'
import { UserStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import 'server-only'
import authConfig from '../auth-config'
import { Permission } from '../permissions'
import { AuthSession, AuthUser } from '../types/auth'

export const getTypedSession = async (): Promise<AuthSession | null> => {
  const session = await getServerSession(authConfig)

  console.log({ session })

  if (session === null) {
    return null
  }

  return {
    expires: session.expires,
    user: session.user as AuthUser
  }
}

export const getHasPermission = async () => {
  const session = await getTypedSession()

  return {
    session,
    hasPermission(permission: Permission): boolean {
      if (session === null) {
        return false
      }
      return session.user.permissions?.includes(permission)
    }
  }
}

export const ensurePermission = async (permission: Permission) => {
  const { session, hasPermission } = await getHasPermission()

  if (!hasPermission(permission)) {
    redirect(getDefaultLoginRedirect(session?.user.permissions ?? []))
  }

  return { session, hasPermission }
}

export const getUserSession = async () => {
  const session = await getTypedSession()

  if (session === null) {
    return null
  }

  if (session.user.status !== UserStatus.ACTIVE) {
    return null
  }

  return session
}
