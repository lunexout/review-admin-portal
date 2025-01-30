'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect } from 'react'

export default function LocaleError({
  error,
  // If your linter warns "Props must be serializable for components in the "use client" entry file, "reset" is invalid.", then it's a bug. It should've been fixed long time ago [here](https://github.com/vercel/next.js/pull/46898), but I still see the warning.
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('LocaleError')

  useEffect(() => {
    // ? Do we need to use external reporting service or is Vercel logging enough?
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-3 rounded-3xl bg-background py-20">
      <div className="flex items-center justify-center rounded-full bg-custom-middleBlue p-5">
        <Image
          src="/img/no-data.png"
          alt="No data"
          width={72 * 2}
          height={72 * 2}
        />
      </div>
      <h2 className="mt-4 text-2xl font-medium">{t('title')}</h2>
      <Button onClick={reset}>{t('retry')}</Button>
    </div>
  )
}
