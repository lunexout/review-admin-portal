import { ensurePermission } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui-custom/tabs'
import { UrlParamsToast } from '@/components/ui-custom/url-params-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { getBusinessDetails } from '@/modules/business/queries/get-business-details'
import { Link } from '@/navigation'
import { HomeIcon, ImageIcon, PencilIcon } from 'lucide-react'
import { type Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { BusinessBanner } from '../../_components/banners/business-banner'
import { RouterTabs } from './_components/router-tabs'

const tabValues = {
  information: 'information',
  map: 'map'
} as const

const businessTabsOrdered = [tabValues.information, tabValues.map]

type PageParams = {
  businessId: string
}

export async function generateMetadata({
  params
}: {
  params: PageParams
}): Promise<Metadata> {
  // const course = await getCourseDetails(params.businessId)
  const title = 'Business'

  return {
    title
  }
}

export default async function BusinessDetailsLayout({
  children,
  params
}: {
  children: ReactNode
  params: PageParams
}) {
  await ensurePermission('business:manage')

  const { businessId } = await params

  const business = await getBusinessDetails(businessId)

  const t = await getTranslations('BusinessDetailsPage')

  if (business === null) {
    notFound()
  }

  return (
    <div className="flex w-full justify-center mt-4">
      <div className="max-w-screen-xl p-6 rounded-2xl border w-full gap-4 flex flex-col">
        <UrlParamsToast
          message={t('business_created')}
          urlParamName="business_created"
        />

        <BusinessBanner
          bannerFileKey={business.banner ?? null}
          noBannerLabel={t('no_business_banner_uploaded')}
        />

        <div className="flex justify-between w-full items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="-mr-4 size-6 border">
              <AvatarImage
                // TODO AWS S3
                src={business.icon ?? undefined}
                alt="Business icon"
              />
              <AvatarFallback className="bg-transparent">
                <ImageIcon className="size-3 text-primary" />
              </AvatarFallback>
            </Avatar>

            <Tooltip>
              <TooltipTrigger asChild>
                <h1 className="line-clamp-1 break-words text-2xl font-semibold leading-snug tracking-tight ml-2">
                  {business.name}
                </h1>
              </TooltipTrigger>
              <TooltipContent side="top">{business.name}</TooltipContent>
            </Tooltip>
          </div>
          <Button variant="outline">
            <PencilIcon />
            Edit business
          </Button>
        </div>
        <RouterTabs>
          <TabsList>
            {businessTabsOrdered.map((tab, index) => {
              return (
                <Link key={tab} href={`/admin/businesses/${businessId}/${tab}`}>
                  <TabsTrigger
                    value={tab}
                    className={cn(index === 0 && 'px-4')}
                  >
                    {index === 0 ? (
                      <HomeIcon className="size-5" />
                    ) : (
                      t(`tabs.${tab}`)
                    )}
                  </TabsTrigger>
                </Link>
              )
            })}
          </TabsList>
          {businessTabsOrdered.map((tab) => {
            return (
              <TabsContent key={tab} value={tab}>
                {children}
              </TabsContent>
            )
          })}
        </RouterTabs>
      </div>
    </div>
  )
}
