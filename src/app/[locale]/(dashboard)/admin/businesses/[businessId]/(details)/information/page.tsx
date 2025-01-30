import { getHasPermission } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { getBusinessDetails } from '@/modules/business/queries/get-business-details'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { BusinessPriceBadges } from '../../../_components/badges/business-price-badges'
import { BusinessServiceBadges } from '../../../_components/badges/business-service-badges'
import { BusinessTypeBadges } from '../../../_components/badges/business-type-badges'

const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-1.5 text-xs font-medium leading-none text-muted-foreground">
      {children}
    </div>
  )
}

const Value = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="line-clamp-5 break-words text-sm font-semibold">
      {children}
    </div>
  )
}

export default async function BusinessInformationPage({
  params
}: {
  params: { businessId: string }
}) {
  const { businessId } = await params

  const { hasPermission } = await getHasPermission()

  const business = await getBusinessDetails(businessId)

  if (business === null) {
    notFound()
  }

  const t = await getTranslations('BusinessInformationPage')

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label>{t('types')}</Label>
          <div className="mt-1">
            <BusinessTypeBadges types={business.types} />
          </div>
        </div>
        <div>
          <Label>{t('services')}</Label>
          <div className="mt-1">
            <BusinessServiceBadges services={business.services} />
          </div>
        </div>
        <div>
          <Label>{t('prices')}</Label>
          <div className="mt-1">
            <BusinessPriceBadges prices={business.priceTier} />
          </div>
        </div>
        <div>
          <Label>{t('addresses')}</Label>
          <Value>
            {business.addresses.map((address) => address.address).join(', ')}
          </Value>
        </div>
      </div>
      <div>
        <Label>{t('description')}</Label>
        <p className="text-sm">{business.description || '—'}</p>
      </div>
    </div>
  )
}
