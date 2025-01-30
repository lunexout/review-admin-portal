import { UserStatus } from '@prisma/client'

/**
 * The shape of the returned object in the OAuth providers' `profile` callback, available in the `jwt` and `session` callbacks.
 */
export type AuthUser = {
  id: string
  name: string
  email: string | null
  image: string | null
  status: UserStatus
  permissions: Array<string>
}

/**
 * Session returned by the `auth()` function.
 */
export type AuthSession = {
  expires: string // ISO date string
  user: AuthUser
}
