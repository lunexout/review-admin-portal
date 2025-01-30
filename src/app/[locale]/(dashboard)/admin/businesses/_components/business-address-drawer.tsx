// BusinessAddressPreview.tsx

import { ReusableSheet } from '@/components/ui-custom/drawer/drawer'
import { Badge } from '@/components/ui/badge'
import NoSSR from '@/lib/no-ssr'
import { BusinessAddress } from '@prisma/client'
import { useState } from 'react'

interface BusinessAddressPreviewProps {
  address: BusinessAddress
}

export const BusinessAddressPreview = ({
  address
}: BusinessAddressPreviewProps) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const handleClick = () => {
    setDrawerOpen(true)
  }

  return (
    <div>
      <NoSSR>
        <ReusableSheet
          trigger={
            <Badge
              variant="outline"
              className="text-sm text-gray-800 bg-gray-100 hover:bg-gray-200"
            >
              {address.address}
            </Badge>
          }
          title="Address Details"
          description="Here are the details of the address, including the map and other information."
        >
          <div className="space-y-4">
            <div className="w-full h-[70vh]">
              <iframe
                src="https://www.google.com/maps/place/%E1%83%97%E1%83%91%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%E1%83%98%E1%83%A1+%E1%83%A1%E1%83%90%E1%83%91%E1%83%90%E1%83%95%E1%83%A8%E1%83%95%E1%83%9D+%E1%83%91%E1%83%90%E1%83%92%E1%83%90-%E1%83%91%E1%83%90%E1%83%A6%E1%83%98+%23+90/@41.727502,44.790915,18z/data=!4m6!3m5!1s0x404473770a1955a1:0x222017a74731ffa4!8m2!3d41.727333!4d44.790185!16s%2Fg%2F11hy_qdfny?hl=en-US&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Address: {address.address}
              </p>
              {address.googleMapUrl && (
                <a
                  href={address.googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View in Google Maps
                </a>
              )}
            </div>
          </div>
        </ReusableSheet>
      </NoSSR>
    </div>
  )
}
