import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { TableCell, TableRow } from '@/components/ui/table'

type Props = {
  title?: ReactNode
  subtitle?: string
  className?: string
  titleClassName?: string
  image?: ReactNode
}

export const NoResultsFoundContent = ({
  title,
  subtitle,
  className,
  titleClassName,
  image
}: Props) => {
  const t = useTranslations('NoResultsFoundContent')

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {image ?? (
        <div className="mb-5 flex items-center justify-center rounded-full bg-custom-middleBlue p-5">
          <Image
            src="/img/no-results.png"
            alt="No results"
            width={300}
            height={300}
          />
        </div>
      )}
      <h2
        className={cn(
          'max-w-[500px] text-center text-2xl font-semibold',
          titleClassName
        )}
      >
        {title ?? t('no_results_found')}
      </h2>
      <h3 className="mt-3 text-base font-medium text-muted-foreground">
        {subtitle ?? t('try_different_search_filters')}
      </h3>
    </div>
  )
}

export const NoResultsFound = ({
  colSpan,
  ...props
}: { colSpan: number } & Props) => {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="py-24 text-center">
        <NoResultsFoundContent {...props} />
      </TableCell>
    </TableRow>
  )
}
