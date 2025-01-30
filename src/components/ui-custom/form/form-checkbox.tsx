import type * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  useFormField
} from '@/components/ui/form'

export const FormCheckbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  {
    label: string
    description?: string
    value: boolean | 'indeterminate'
    onChange: (value: boolean | 'indeterminate') => void
    disabled?: boolean
  }
>(({ label, description, value, onChange, disabled }, ref) => {
  const { error } = useFormField()

  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 px-1">
      <FormControl>
        <Checkbox
          checked={value}
          onCheckedChange={onChange}
          ref={ref}
          disabled={disabled}
          className={cn({ 'border-destructive': error !== undefined })}
        />
      </FormControl>
      <div className="flex flex-col gap-y-1 leading-none">
        <FormLabel className="text-base font-medium leading-none">
          {label}
        </FormLabel>
        {description && (
          <FormDescription className="text-xs font-normal">
            {description}
          </FormDescription>
        )}
      </div>
    </FormItem>
  )
})

FormCheckbox.displayName = 'FormCheckbox'
