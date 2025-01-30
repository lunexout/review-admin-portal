/* eslint-disable @typescript-eslint/no-unused-vars */
import { prismaWithoutExtensions } from '@/server/prisma-without-extension'
import { UserStatus } from '@prisma/client'
import { NextAuthOptions } from 'next-auth'
import { z } from 'zod'
import { log } from '../logger'
import { getAllowedSigninMethod } from '../permissions'
import { logCallback } from './shared'

const existingUserSchema = z.object({
  status: z.nativeEnum(UserStatus)
})

/**
 * Controls whether a user is allowed to sign in or not.
 *
 * - Returning `true` continues the sign-in flow.
 * - Returning `false` or throwing an error will stop the sign-in flow and redirect the user to the error page. Returning `false` throws an `AuthorizedCallbackError` with the message `"AccessDenied"`.
 * - Returning a string will redirect the user to the specified URL.
 *
 * Unhandled errors will throw an `AccessDenied` with the message set to the original error.
 */
export const authCallbackSignIn: NonNullable<
  NextAuthOptions['callbacks']
>['signIn'] = async ({
  /**
   * A user represents a person who can sign in to the application.
   * If a user does not exist yet, it will be created when they sign in for the first time, using the information (profile data) returned by the identity provider.
   *
   * A corresponding account is also created and linked to the user (if using OAuth flow).
   *
   * When using Auth.js with a database, the User object will be either:
   * - A user object from the database (including the User ID) if the user has signed in before.
   * - A simpler prototype user object (i.e. name, email, image) for users who have not signed in before.
   */
  user,
  /**
   * Usually contains information about the provider being used and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   *
   * Examples:
   * - When signing in with Google for the first time, it contains:
   * {
   *   id_token - is used for authentication (Sign-in, OpenID connect). It identifies the user behind the machine as being well themselves. It's a JWT which contains user's email, name, picture and other properties (see Profile).
   *   access_token - is for authorization (OAuth2), they are bearer tokens. An access token gives the bearer of token access to a set of data.
   *   expires_in: 3598
   *   refresh_token
   *   scope: https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid
   *   token_type: "bearer"
   *   expires_at: 1709312647
   *   provider: "google"
   *   type: "oidc"
   *   providerAccountId: "48239482394"
   * }
   */
  account,

  profile,
  email: _email,
  /**
   * If Credentials provider is used, it contains the user credentials.
   */
  credentials
}) => {
  console.log('SIGN IN CALLBACK:', { user, account, profile })
  logCallback('callback-sign-in')

  // This flow is already handled in the Credentials provider.
  if (credentials !== undefined) {
    return true
  }

  const maybeExistingUser = existingUserSchema.safeParse(user)

  // User object has no `status`, which means the user is trying to authenticate for the first time with OAuth account which is not linked to his user entity.
  if (!maybeExistingUser.success) {
    // Not sure this is possible on practice if signing in with OAuth.
    // Returning false will redirect the user to error page with ?error=AccessDenied
    if (typeof user.email !== 'string') {
      return false
    }

    // Find existing user by email
    const dbUser = await prismaWithoutExtensions.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        password: true,
        status: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })

    // User with the given email doesn't exist. We don't allow creating new users with OAuth — only possible to sign in to existing user profiles.
    if (dbUser === null) {
      return false
    }

    //TODO make role required
    const allowedSigninMethod = getAllowedSigninMethod(dbUser.role?.name ?? '')

    if (allowedSigninMethod !== 'oauth') {
      return false
    }

    if (dbUser.status === UserStatus.INACTIVE) {
      log('User is inactive')
      return false
    }

    if (dbUser.status === UserStatus.PENDING) {
      log('User is pending')
      return false
    }

    // Try to link accounts. If account cannot be linked, user will be redirected to the current URL with ?error=OAuthAccountNotLinked
    return true
  }

  // Signing in with Credentials or with OAuth (but only if user already exists in the database).

  const existingUser = maybeExistingUser.data

  if (existingUser.status === UserStatus.INACTIVE) {
    log('User is inactive')
    return false
    // return buildOAuthErrorURL(customCredentialsErrorCodes.credentials_user_inactive_error)
  }

  if (existingUser.status === UserStatus.PENDING) {
    log('User is pending')
    return false
    // return buildOAuthErrorURL(customCredentialsErrorCodes.credentials_user_pending_error)
  }

  return true // Allow sign-in
}
