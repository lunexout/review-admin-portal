import { siteConfig } from '@/site-config'
import { type MetadataRoute } from 'next'

// TODO Not needed right now, but will eventually need. Check Next.js documentation for more built-in SEO capabilities.
// Reference: https://github.com/ixartz/Next-js-Boilerplate/blob/main/src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  }
}
