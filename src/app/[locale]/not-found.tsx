'use client'

import Error from 'next/error'

// https://next-intl-docs.vercel.app/docs/environments/error-files#catching-non-localized-requests
export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  )
}
