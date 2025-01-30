import { permissions } from './auth/permissions'

/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 */
export const publicRoutes = [
  '/',
  '/invitation-expired',
  '/password-recovery-expired'
  // '/pin-recovery-expired',
  // '/create-new-pin-code'
] as const satisfies string[]

/**
 * When logged in user hits of these routes, they will be redirected to `getDefaultLoginRedirect()`
 */
export const routesOnlyForUnauthenticatedUser = [
  '/sign-in',
  '/create-password',
  // '/auth-error',
  // '/create-new-pin-code',
  '/create-new-password'
  // '/staff/signin',
  // '/staff/confirm-invitation'
] as const satisfies string[]

export const adminRoutes = ['/admin'] as const satisfies string[]

// export const teacherRoutes = ['/teacher'] as const satisfies string[]

// export const parentRoutes = ['/parent'] as const satisfies string[]

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 */
export const apiAuthPrefix = '/api/auth' as const

/**
 * The default redirect path after logging in.
 */
export const getDefaultLoginRedirect = (userPermissions: Array<string>) => {
  if (userPermissions.includes(permissions.accessAdminPortal)) {
    return '/admin/businesses'
  }
  // if (userPermissions.includes(permissions.accessTeacherPortal)) {
  //   return '/teacher'
  // }

  return '/'
}
