/**
 * Configuration of the Google provider.
 *
 * Requires AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET environment variables to be set.
 *
 * Callback URL that should be set in Google dashboard:
 * - Callback URL: [origin]/api/auth/callback/google
 * - You need to register a separate OAuth app for each environment.
 *
 * References:
 * - https://authjs.dev/getting-started/authentication/oauth
 */
import { env } from '@/lib/env'
import createGoogleProvider from 'next-auth/providers/google'

export const authGoogleProvider = createGoogleProvider({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
  authorization: {}
  // async profile(profile) {
  //   return {
  //     id: profile.sub,
  //     email: profile.email,
  //     name: profile.name,
  //     image: profile.picture // Store Google profile picture
  //   }
  // }
})

// What happens when you call `signIn('google')` to sign in for the first time:
// - GET /api/auth/providers
// - GET /api/auth/csrf
// - POST /api/auth/signin/google
// Opens https://accounts.google.com/signin/oauth/id with this query params:
//   - authuser=0
//   - part=...
//   - flowName=GeneralOAuthFlow
//   - as=S1409530881%3A1709308942596469
//   - client_id=...
//   - rapt=...
//   - theme=glif
// After user authorizes:
// - GET /api/auth/callback/google
// - DB: Selects Account by `provider` and `providerAccountId`
// - Calls [callback-sign-in] with { user, account, profile }
// - DB: Selects Account by `provider` and `providerAccountId`
// - DB: Selects User by `email`
// - No user yet, so DB: Inserts User
// - Event fired: createUser
// - DB: Inserts Account
// - Event fired: linkAccount
// (skipped for JWT session) - DB: Inserts Session
// - Calls [callback-jwt]
// - Calls [callback-session]
// - Event fired: session
