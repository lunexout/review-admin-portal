import type { Table } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'

export const DataTableResetFiltersButton = <TData,>({
  table,
  size = 'sm',
  alwaysVisible = false,
  onClick
}: {
  table: Table<TData>
  size?: 'sm' | 'lg'
  alwaysVisible?: boolean
  onClick?: () => void
}) => {
  const t = useTranslations('DataTableResetFiltersButton')

  const isFiltered = table.getState().columnFilters.length > 0

  if (!isFiltered && !alwaysVisible) {
    return null
  }

  return (
    <Button
      variant="destructive"
      onClick={() => {
        table.resetColumnFilters()
        onClick?.()
      }}
      className={cn('px-4', {
        'h-8': size === 'sm'
      })}
      size={size === 'sm' ? 'sm' : 'default'}
    >
      {t('reset')}
      <XIcon
        className={cn('ml-2 size-5', {
          'size-4': size === 'sm'
        })}
      />
    </Button>
  )
}
