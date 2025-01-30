/* eslint-disable @typescript-eslint/no-unused-vars */
import { prismaWithoutExtensions } from '@/server/prisma-without-extension'
import { NextAuthOptions } from 'next-auth'
import { AuthUser } from '../types/auth'
import { logCallback } from './shared'

/**
 * This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client).
 *
 * The returned value is encrypted and is stored in a cookie.
 *
 * Its content is forwarded to the `session` callback, where you can control what should be returned to the client. Anything else will be kept from your front-end.
 *
 * Requests to /api/auth/signin, /api/auth/session and calls to getSession(), getServerSession(), useSession() will invoke this function.
 * - Token expiry time is extended whenever a session is active.
 * - The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session, after the user signs in. In subsequent calls, only token will be available.
 *
 * The contents user, account, profile and isNewUser will vary depending on the provider and on if you are using a database or not. You can persist data such as User ID, OAuth Access Token in this token. To make it available in the browser, check out the `session()` callback as well.
 *
 * Use an `if` branch to check for the existence of parameters (apart from token). If they exist, this means that the callback is being invoked for the first time (i.e. the user is being signed in). This is a good place to persist additional data like an access_token in the JWT. Subsequent invocations will only contain the token parameter.
 */
export const authCallbackJwt: NonNullable<
  NextAuthOptions['callbacks']
>['jwt'] = async ({ token, user, session, profile }) => {
  logCallback('callback-jwt')

  /**
   * 1. Sign in with OAuth (no matter first time or not) -> `user` contains { id, name, email, status, roleId, ... } and other fields from the database. But no related models (e.g. no Role and Permissions).
   * 2. Sign in with Credentials -> `user` contains { id, name, email, image, status, permissions }
   * 3. Whenever session is accessed on the client (`auth()`), the `user` will be undefined, but the token already exists and contains necessary information.
   */

  console.log({ user })
  if (user) {
    // This assumption is incorrect. The type depends on the used provider. Logging in with Credentials results to AuthUser, but logging in with OAuth doesn't have a relation with permission.
    const authUser = user as Omit<AuthUser, 'permissions'> & {
      permissions?: Array<string>
    }

    if (!authUser.permissions) {
      const dbUser = await prismaWithoutExtensions.user.findUnique({
        where: {
          id: authUser.id
        },
        select: {
          role: {
            select: {
              permissions: true
            }
          }
        }
      })

      console.log({ dbUser })

      authUser.permissions = dbUser?.role?.permissions ?? []
    }

    console.log({ authUser })

    token.id = authUser.id
    token.name = authUser.name
    token.email = authUser.email
    token.image =
      authUser.image ??
      (profile?.image || (profile as { picture: string })?.picture)
    token.status = authUser.status
    token.permissions = authUser.permissions
  }

  // The `session` object comes when calling `unstable_update()`
  if (session && session.user) {
    for (const key in session.user) {
      token[key] = session.user[key]
    }
  }

  console.log({ token })

  return token
}
