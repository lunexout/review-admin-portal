import { Badge } from '@/components/ui/badge'
import { BusinessType } from '@prisma/client'
import { useTranslations } from 'next-intl'

export const BusinessTypeBadges = ({
  types
}: {
  types: Array<BusinessType>
}) => {
  const t = useTranslations('SelectBusinessTypes')

  return (
    <div className="flex items-ceter gap-x-2">
      {types.map((name) => (
        <Badge key={name} variant="secondary">
          {t(name.toLowerCase())}
        </Badge>
      ))}
    </div>
  )
}
