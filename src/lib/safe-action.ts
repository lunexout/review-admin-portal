import { UserStatus } from '@prisma/client'
import { createSafeActionClient } from 'next-safe-action'
import { values } from 'remeda'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

import { signOut } from '@/auth/auth'
import { getTypedSession } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { permissions, type Permission } from '@/auth/permissions'

import { AuthSession } from '@/auth/types/auth'
import { tuplifyUnion } from './tuplify-union'

export class ActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ActionError'
  }
}

const DEFAULT_SERVER_ERROR =
  'Something went wrong while executing the operation.'

// Use this to build a server action that doesn't require user authentication.
export const nonAuthActionClient = createSafeActionClient({
  handleServerError(error) {
    console.error('[Server action] Action error:', error.message)
    if (process.env.NODE_ENV === 'development') {
      return error.message || DEFAULT_SERVER_ERROR
    }
    if (error instanceof ActionError) {
      return error.message
    }
    return DEFAULT_SERVER_ERROR
  }
}).use(async ({ next, clientInput, metadata, bindArgsClientInputs }) => {
  console.log('[Server action] Action input:', clientInput)
  console.log('[Server action] Action input (bind):', bindArgsClientInputs)
  console.log('[Server action] Action metadata:', metadata)

  const result = await next({ ctx: undefined })

  console.log(
    '[Server action] Action result:',
    process.env.NODE_ENV === 'development'
      ? JSON.stringify(result, null, 2)
      : result
  )

  return result
})

const validSessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  image: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.PENDING]),
  permissions: z.array(z.string())
})

const validSessionSchema = z.object({
  user: validSessionUserSchema
})

export const authActionClient = createSafeActionClient({
  defineMetadataSchema() {
    const permissionValues = tuplifyUnion(values(permissions))

    const permissionSchema = z.enum(permissionValues)

    const singlePermissionSchema = z.enum([...permissionValues, 'none'])

    return z.object({
      permission: singlePermissionSchema.or(z.array(permissionSchema))
    })
  },
  handleServerError(error) {
    console.error('[Server action] Action error:', error.message)
    if (process.env.NODE_ENV === 'development') {
      return error.message || DEFAULT_SERVER_ERROR
    }
    if (error instanceof ActionError) {
      return error.message
    }
    return DEFAULT_SERVER_ERROR
  }
})
  .use(async ({ next, clientInput, metadata, bindArgsClientInputs }) => {
    console.log('[Server action] Action input:', clientInput)
    console.log('[Server action] Action input (bind):', bindArgsClientInputs)
    console.log('[Server action] Action metadata:', metadata)

    const result = await next({ ctx: undefined })

    console.log(
      '[Server action] Action result:',
      process.env.NODE_ENV === 'development'
        ? JSON.stringify(result, null, 2)
        : result
    )

    return result
  })
  .use(async ({ metadata, next }) => {
    const session = await getTypedSession()

    if (session === null) {
      throw new ActionError('The user is unauthenticated.')
    }

    if (session.user.status === UserStatus.INACTIVE) {
      throw new ActionError('The user is inactive.')
    }

    if (session.user.status === UserStatus.PENDING) {
      throw new ActionError('The user is not active yet.')
    }

    if (metadata.permission !== 'none') {
      if (typeof metadata.permission === 'string') {
        throwIfNoPermission(session, metadata.permission)
      } else {
        throwIfNoPermissions(session, metadata.permission)
      }
    }

    const validSession = validSessionSchema.safeParse(session)
    if (!validSession.success) {
      console.error('The session is malformed.', {
        errors: fromError(validSession.error).toString()
      })
      await signOut()
      throw new ActionError('The session is malformed.')
    }

    return next({
      ctx: {
        session: {
          expires: session.expires,
          user: validSession.data.user
        }
      }
    })
  })

export const throwIfNoPermission = async (
  session: AuthSession,
  permission: Permission
) => {
  if (!session.user.permissions.includes(permission)) {
    console.error(`The user is missing a required permission`, { permission })
    throw new ActionError(
      `The user is missing a required permission: "${permission}".`
    )
  }
}

export const throwIfNoPermissions = async (
  session: AuthSession,
  permissions: Permission[]
) => {
  const hasAnyPermission = permissions.some((permission) =>
    session.user.permissions.includes(permission)
  )

  if (!hasAnyPermission) {
    console.error(`The user is missing one of the required permissions`, {
      permissions
    })
    throw new ActionError(
      `The user is missing one of the required permissions: "${permissions.join(', ')}".`
    )
  }
}
