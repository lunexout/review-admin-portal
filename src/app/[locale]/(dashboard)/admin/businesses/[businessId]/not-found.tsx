import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function BusinessNotFound() {
  const t = useTranslations('BusinessNotFound')

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-3 rounded-3xl bg-background py-20">
      <div className="flex items-center justify-center rounded-full bg-custom-middleBlue p-5">
        <Image
          src="/img/no-results.png"
          alt="No data"
          width={72 * 2}
          height={72 * 2}
        />
      </div>
      <h2 className="mt-4 text-2xl font-medium">{t('business_not_found')}</h2>
      <Button asChild>
        <Link href="/admin/businesses">{t('back_to_businesses')}</Link>
      </Button>
    </div>
  )
}
