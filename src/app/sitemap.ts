import { siteConfig } from '@/site-config'
import { type MetadataRoute } from 'next'

// TODO Not needed right now, but will eventually need. Check Next.js documentation for more built-in SEO capabilities.
// Reference: https://github.com/ixartz/Next-js-Boilerplate/blob/main/src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [''].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString()
  }))

  return [...routes]
}
