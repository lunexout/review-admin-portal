// TODO: Use Pino for logging instead of `console.log`
import { env } from '@/lib/env'
import { LoggerInstance } from 'next-auth'

const createLogger = (debug: boolean) => {
  return function log(...message: any) {
    if (debug) {
      console.log('[NextAuth]', ...message)
    }
  }
}

export const log = createLogger(env.DEBUG_NEXT_AUTH)

export const nextAuthLoggerConfig = env.DEBUG_NEXT_AUTH
  ? {
      debug: true,
      logger: {
        error(code, ...message) {
          console.error(code, message)
        },
        warn(code, ...message) {
          console.warn(code, message)
        },
        debug(code, ...message) {
          console.debug(code, message)
        }
      } satisfies LoggerInstance
    }
  : {
      debug: false,
      logger: undefined
    }
