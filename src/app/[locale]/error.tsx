'use client'

import { lazy } from 'react'

// Move error content to a separate chunk and load it only when needed
// https://next-intl-docs.vercel.app/docs/environments/error-files#errorjs
export default lazy(() => import('./error-impl'))
