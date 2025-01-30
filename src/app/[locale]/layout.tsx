import type { Metadata, Viewport } from 'next'
import { getMessages } from 'next-intl/server'
// import localFont from 'next/font/local'
import '../globals.css'

import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

import { routing } from '@/navigation'
import Script from 'next/script'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { siteConfig } from '@/site-config'
import { Poppins } from 'next/font/google'
import { Toaster } from 'sonner'

const poppins = Poppins({
  subsets: ['latin'], // Add additional subsets like 'latin-ext' or 'devanagari' if needed
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // All available font weights
  style: ['normal', 'italic'], // Include italic styles if required
  display: 'swap' // Recommended for performance
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [],
  authors: [],
  creator: '',
  // openGraph: {
  //   type: 'website',
  //   locale: 'en_US',
  //   url: siteConfig.url,
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   siteName: siteConfig.name,
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [`${siteConfig.url}/og.jpg`],
  //   creator: '',
  // },
  // icons: {
  //   icon: "/icon.png",
  // },
  icons: [{ rel: 'icon', url: '/favicon.ico' }]

  // I had to configure CORS in vercel.json file, otherwise it throws 401 Unauthorized on the testing environment. I don't know why, and I don't know whether enabling CORS is a right solution.
  // See https://github.com/vercel/next.js/discussions/62867
  // manifest: `${siteConfig.url}/manifest.json`,
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Await params.locale to ensure it's ready
  const { locale } = await params

  const typedLocale = locale as 'en' | 'ge'

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(typedLocale)) {
    notFound()
  }

  // Providing all messages to the client
  const messages = await getMessages({ locale: typedLocale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={poppins.className}>
        <Toaster richColors />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NuqsAdapter>
            {/* <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            > */}
            {children}
            {/* </ThemeProvider> */}
          </NuqsAdapter>
        </NextIntlClientProvider>

        <Script
          src="https://visgl.github.io/react-google-maps/scripts/examples.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
