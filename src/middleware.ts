// /* eslint-disable @typescript-eslint/no-unused-vars */
// Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
//
// Middleware allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.
//
// Middleware currently only supports the Edge runtime. The Node.js runtime cannot be used.
//
// Middleware execution order: https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths
// ---
// NextResponse: https://nextjs.org/docs/app/building-your-application/routing/middleware#nextresponse
//
// - Redirects will reroute to a new page and show the URL changes.
// - Rewrites allow you to map an incoming request path to a different destination path. Rewrites act as a URL proxy and mask the destination path, making it appear the user hasn't changed their location on the site.
// - Set request headers for API Routes, getServerSideProps, and rewrite destinations (why?)
// - Set response headers and cookies
//
// To produce a response:
// - Rewrite to a route (Page or Route Handler) that produces a response.
// - Return a NextResponse directly.

import { withAuth } from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import { permissions } from './auth/permissions'
import { AuthUser } from './auth/types/auth'
import { routing } from './navigation'
import {
  adminRoutes,
  getDefaultLoginRedirect,
  publicRoutes,
  routesOnlyForUnauthenticatedUser
} from './routes'

const SILENT = true

const log = (name: string, input?: unknown) => {
  if (!SILENT) {
    if (input) {
      console.log(`- Middleware [${name}]`, JSON.stringify(input, null, 2))
    } else {
      console.log(`- Middleware [${name}]`)
    }
  }
}

const testPathnameRegex = (pages: string[], pathName: string): boolean => {
  return RegExp(
    `^(/(${routing.locales.join('|')}))?(${pages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  ).test(pathName)
}

const i18nMiddleware = createMiddleware(routing)

// const { auth: authMiddleware } = NextAuth(authConfig)

// TODO: Do we want to add some of these middlewares? https://www.58bits.com/blog/chaining-or-combining-nextjs-middleware

/**
 * Wrapping the middleware function with `authMiddleware` adds `req.auth` property.
 *
 * The inner `afterAuth` function is executed after all Auth.js callbacks.
 *
 * `authMiddleware` keeps the session alive, and updates the session expiry every time it's called (as per documentation).
 */
export const middleware = i18nMiddleware
export const middleware2 = withAuth(
  async (request) => {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#waituntil-and-nextfetchevent

    const { nextUrl } = request

    console.log('REQUEST,Z', { AUTH: request.nextauth.token })
    const authUser = (request.nextauth.token ?? null) as AuthUser | null

    if (nextUrl.pathname.includes('manifest.json')) {
      return NextResponse.next()
    }

    const isPublicRoute = testPathnameRegex(publicRoutes, nextUrl.pathname)
    const isRouteOnlyForUnauthenticatedUser = testPathnameRegex(
      routesOnlyForUnauthenticatedUser,
      nextUrl.pathname
    )

    const isAdminRoute = testPathnameRegex(adminRoutes, nextUrl.pathname)

    log(
      'Incoming request',
      `${request.method} ${request.nextUrl.pathname}${request.nextUrl.search ? request.nextUrl.search : ''}`
    )

    const next = () => {
      return i18nMiddleware(request)
    }

    if (isAdminRoute) {
      if (
        authUser !== null &&
        !authUser.permissions.includes(permissions.accessAdminPortal)
      ) {
        log('Admin route, no permission - redirecting to /')
        return Response.redirect(new URL('/', nextUrl))
      }
    }

    if (isRouteOnlyForUnauthenticatedUser) {
      if (authUser !== null) {
        log(
          'Route for unauthenticated user, but user is authenticated - redirecting to default page'
        )

        return Response.redirect(
          new URL(getDefaultLoginRedirect(authUser.permissions), nextUrl)
        )
      }
      log('Route for unauthenticated user - proceeding')
      return next()
    }

    if (authUser === null && !isPublicRoute) {
      log('Protected route, but user is unauthenticated - redirecting to login')

      // Construct the full callback URL (current pathname + search query if any)
      let callbackUrl = nextUrl.pathname
      if (nextUrl.search) {
        callbackUrl += nextUrl.search
      }

      // Encode the callback URL properly
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)

      // Check if the callbackUrl is empty or just points to the home page
      if (encodedCallbackUrl === encodeURIComponent('/')) {
        return NextResponse.redirect(new URL(`/sign-in`, nextUrl)) // Redirect to the sign-in page without callback if the URL is just "/"
      }

      // Redirect to sign-in page with the correct callback URL
      return NextResponse.redirect(
        new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      )
    }

    log('Proceeding')
    return next()
  },
  {
    // pages: { signIn: 'sign-in' },
    callbacks: {
      authorized: ({ token }) => Boolean(token) // Only allow authenticated users
    }
  }
)

export const config = {
  /**
   * Matcher allows you to filter Middleware to run on specific paths.
   *
   * Matcher entries are linked with a logical "or", therefore if one of them matches, the middleware will be invoked.
   */
  matcher: [
    // Copied from https://clerk.com/docs/references/nextjs/clerk-middleware with some adjustments.
    // Skip Next.js internals and all static files, unless found in search params.
    // This regular expression matches any string that does not contain a file extension, the substring "_next" and substring "monitoring".
    // - "?!" - negative lookahead, to match all request paths except for:
    //   - file extensions which are not in search params.
    //   - "_next"       - checks if the substring `_next` is present.
    //     - _next/static and _next/images shouldn't be processed by middleware
    //   - "monitoring" - exclude tunnelRoute used in Sentry from the matcher
    // '/((?!.+\\.[\\w]+$|_next|monitoring|api).*)',
    '/((?!_next|monitoring|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // This entry handles the root of the base path and should always be included.
    '/'
  ]
}
