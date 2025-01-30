import { NextAuthOptions } from 'next-auth'
import { authCallbackJwt } from './auth-callbacks/auth-callback-jwt'
import { authCallbackSession } from './auth-callbacks/auth-callback-session'
import { authCallbackSignIn } from './auth-callbacks/auth-callback-sign-in'
import { authGoogleProvider } from './auth-providers/auth-google-provider'

// TODO: Note: Auth.js does not currently handle Access Token rotation for OAuth providers for you, however, you can check out this tutorial if you want to implement it.
// https://authjs.dev/guides/basics/refresh-token-rotation

// We are splitting the auth configuration into multiple files (`auth.config.ts` and `auth.ts`), as some adapters (Prisma) and Node APIs (`stream` module required for sending emails) are not supported in the Edge runtime. More info here: https://authjs.dev/guides/upgrade-to-v5
const authConfig = {
  providers: [
    // Google provider (Admin-only login)
    authGoogleProvider
  ],

  session: {
    strategy: 'jwt' // Use JWT for session
  },

  callbacks: {
    signIn: authCallbackSignIn,
    jwt: authCallbackJwt,
    session: authCallbackSession
  },
  pages: {
    // This disables the built-in /api/auth/signin page. We have a completely custom login page, and we don't need a built-in version which lists all providers with a default view.
    signIn: '/sign-in',
    signOut: '/signout',
    // error: authErrorURL,

    // We don't have an open user registration.
    newUser: '/',
    // This page is used by Email provider which we don't use, so just redirect from `/api/auth/verify-request` to `/`.
    verifyRequest: '/'
  }
} satisfies NextAuthOptions

export default authConfig
