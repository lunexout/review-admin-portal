import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

// import { buildUrlFromFileKey } from '~/modules/file/aws-s3-url'

export const BusinessBanner = ({
  bannerFileKey,
  noBannerLabel
}: {
  bannerFileKey: string | null
  noBannerLabel: string
}) => {
  // TODO - AWS S3 Bucket generate src from file key
  const maybeFileUrl = bannerFileKey

  return (
    <div
      className={cn(
        'relative h-[210px] w-full rounded-md border',
        !maybeFileUrl && 'border'
      )}
    >
      {maybeFileUrl === null ? (
        <div className="flex h-full flex-col items-center justify-center gap-y-4 rounded-md bg-custom-lightBlue">
          <div className="flex size-16 items-center justify-center rounded-full bg-background">
            <ImageIcon className="size-8 text-primary" />
          </div>
          <div className="font-medium">{noBannerLabel}</div>
        </div>
      ) : (
        <Image
          src={maybeFileUrl}
          alt="Banner"
          className="rounded-md object-cover"
          fill
        />
      )}
    </div>
  )
}
