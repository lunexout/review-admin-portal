import { env } from './lib/env'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Business app',
  description: 'Business app',
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : env.NEXT_PUBLIC_APP_URL
} as const

export const companyName = 'Kikokushijo Academy'
