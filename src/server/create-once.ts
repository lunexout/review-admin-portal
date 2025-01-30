// Ensures that value returned from `construct` is persisted between hot-reloads in development mode.
//

import { env } from '@/lib/env'

// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
export const createOnce = <Property extends string, Value>(
  property: Property,
  construct: () => Value
) => {
  const extendedGlobalThis = globalThis as unknown as Record<
    Property,
    Value | undefined
  >

  const instance = extendedGlobalThis[property] ?? construct()

  if (env.NODE_ENV !== 'production') {
    extendedGlobalThis[property] = instance
  }

  return instance
}
