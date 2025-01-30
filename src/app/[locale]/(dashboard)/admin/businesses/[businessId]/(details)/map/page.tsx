import { getHasPermission } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { GoogleMapProvider } from '@/components/ui-custom/map/google-map-provider'
import { GoogleMapViewer } from '@/components/ui-custom/map/google-map-viewer'
import { getBusinessAddresses } from '@/modules/business/queries/get-business-addresses'
import { getBusinessDetails } from '@/modules/business/queries/get-business-details'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function BusinessMapPage({
  params
}: {
  params: { businessId: string }
}) {
  const { businessId } = await params

  const { hasPermission } = await getHasPermission()

  const business = await getBusinessDetails(businessId)
  const bususinesAddresses = await getBusinessAddresses()

  if (business === null) {
    notFound()
  }

  const t = await getTranslations('BusinessMapPage')

  return (
    <div className="rounded-2xl mt-6 grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 grid-rows-1">
        <GoogleMapProvider>
          <GoogleMapViewer
            markers={bususinesAddresses.map((address) => ({
              lat: address.latitude,
              lng: address.longitude
            }))}
            defaultCenter={{
              lat: business.addresses[0].latitude,
              lng: business.addresses[0].longitude
            }}
          />
        </GoogleMapProvider>
      </div>
    </div>
  )
}
