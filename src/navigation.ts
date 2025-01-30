import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ge'],

  // Used when no locale matches
  defaultLocale: 'en',

  // https://next-intl-docs.vercel.app/docs/routing#locale-prefix-never
  // Technically, we could avoid using i18n routing and eliminate the need for [locale] folder, because:
  // 1. We don't need domain-based routing.
  // 2. We don't have pages with static rendering.
  // TODO: Remove the [locale] folder: https://next-intl-docs.vercel.app/docs/getting-started/app-router/without-i18n-routing
  localePrefix: 'never',

  // We don't use domains or subdomains for localization.
  domains: undefined
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
