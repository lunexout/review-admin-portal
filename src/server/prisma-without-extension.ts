import { env } from '@/lib/env'
import { PrismaClient } from '@prisma/client'
import { createOnce } from './create-once'

export const createPrismaWithoutExtensions = () => {
  return new PrismaClient({
    transactionOptions: {
      // The maximum amount of time Prisma Client will wait to acquire a transaction from the database.
      maxWait: 10000, // 10 seconds
      // The maximum amount of time the interactive transaction can run before being canceled and rolled back.
      timeout: 10000 // 10 seconds
    },
    errorFormat: env.NODE_ENV === 'development' ? 'minimal' : 'colorless',
    log:
      env.NODE_ENV === 'development'
        ? [
            // Logs all SQL queries run by Prisma.
            // Everything is logged to stdout by default.
            // Alternatively, we can use `emit: 'event'` to access more details about the query like `duration` and `params`.
            'query',
            // Logs messages like: "Started http server on http://..."
            'info',
            'error',
            'warn'
          ]
        : ['error']
  })
}

// TODO: Document why in `auth/` files we use `prismaWithoutExtensions` instead of `prisma`. If I'm not mistaken, `auth` is running in the edge environment, and Prisma doesn't support extensions there.
export const prismaWithoutExtensions = createOnce(
  'prisma-without-extensions',
  () => {
    return createPrismaWithoutExtensions()
  }
)
