import NextAuth from 'next-auth'

import authConfig from './auth-config'
import { prismaDatabaseAdapter } from './auth-prisma-adapter/auth-prisma-adapter'
import { AuthSession } from './types/auth'

// Lazy initialization. Allows you to access the request context in the configuration in some cases, like Route Handlers, Middleware, API Routes or getServerSideProps.
// This callback is executed each time the /api/auth/* endpoint is triggered. This is executed after the middleware runs.
export const nextAuth = NextAuth({
  adapter: prismaDatabaseAdapter,
  ...authConfig
})

const {
  /**
   * The NextAuth.js [Route Handler](https://beta.nextjs.org/docs/routing/route-handlers) methods. These are used to expose an endpoint for OAuth/Email providers, as well as REST API endpoints (such as `/api/auth/session`) that can be contacted from the client.
   */
  handlers,
  /**
   * A universal method to interact with NextAuth.js in your Next.js app. Use this method in:
   * - Middleware (Example: middleware.ts)
   * - Server Components (Example: app/../page.ts)
   * - Route Handlers (Example: app/api/../*.route.ts)
   *
   * Jump to the type definition for the examples of usage.
   */
  auth,
  /**
   * Sign in with a provider server-side. If no provider is specified, the user will be redirected to the sign in page. For client-side sign-in use `next-auth/react`.
   *
   * By default, the user is redirected to the current page after signing in. You can override this behavior by setting the `redirectTo` option.
   */
  signIn,
  /**
   * Sign out the user server-side. Invalidates the cookie. For client-side sign-in use `next-auth/react`.
   *
   * By default the user is redirected to the current page after signing out. You can override this behavior by setting the `redirectTo` option.
   */
  signOut,
  unstable_update
} = nextAuth

export { auth, handlers, signIn, signOut }

/**
 * Manually update the token in the `jwt` callback.
 */
type NewSession = {
  user: Partial<AuthSession['user']>
}

export const updateSession = async (
  newSession: NewSession
): Promise<AuthSession | null> => {
  return unstable_update(newSession) as Promise<AuthSession | null>
}
