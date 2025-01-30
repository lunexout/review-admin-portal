import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export const TextAreaDescription = ({
  label,
  value,
  onChange,
  helperLabel,
  isRequired = true,
  className,
  count,
  error
}: {
  label: string
  value: string
  onChange: (value: string) => void
  helperLabel?: string
  isRequired?: boolean
  className?: string
  count?: ReactNode
  error?: boolean
}) => {
  return (
    <div className="grid w-full gap-1">
      <Label asterisk={isRequired} className={cn(error && 'text-destructive')}>
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(className, error && 'border-destructive')}
      />
      <div className="flex justify-between items-center gap-2">
        {helperLabel && (
          <p className="text-sm text-muted-foreground flex-1">{helperLabel}</p>
        )}
        {count && (
          <p
            className={cn(
              'text-sm text-muted-foreground flex flex-1 justify-end w-full',
              error && 'text-destructive'
            )}
          >
            {count}
          </p>
        )}
      </div>
    </div>
  )
}
