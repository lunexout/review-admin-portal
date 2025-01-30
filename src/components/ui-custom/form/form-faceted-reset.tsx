import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'

type Props = {
  onReset: () => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'lg'
}

export const FormFiltersReset = ({
  onReset,
  label,
  disabled,
  size = 'sm'
}: Props) => {
  const t = useTranslations('DataTableResetFiltersButton')

  return (
    <Button
      disabled={disabled}
      variant="destructive"
      onClick={onReset}
      className={cn('px-4', {
        'h-8': size === 'sm'
      })}
      size={size === 'sm' ? 'sm' : 'default'}
      type="button"
    >
      {label ?? t('reset')}
      <XIcon
        className={cn('ml-2 size-5', {
          'size-4': size === 'sm'
        })}
      />
    </Button>
  )
}
