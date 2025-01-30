/**
 * Any environment variant
 */
import { vercel } from '@t3-oss/env-core/presets'
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const booleanFromStringSchema = z
  .enum(['true', 'false'])
  .transform((v) => v === 'true')

export const env = createEnv({
  extends: [
    // Enables Vercel System Environment Variables
    // https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
    vercel()
  ],
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    DEBUG_NEXT_AUTH: booleanFromStringSchema,

    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY: z.string(),
    NEXT_PUBLIC_APP_URL: z.string()
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
})
