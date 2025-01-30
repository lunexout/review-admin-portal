import { forwardRef, type ReactNode } from 'react'

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { InputProps } from '../input-with-icon'

export const FormSimpleInput = forwardRef<
  HTMLInputElement,
  InputProps & {
    isRequired: boolean
    label?: string
    className?: string
    description?: string | ReactNode
    hasAlertIcon?: boolean
    hideMessage?: boolean
  }
>(
  (
    {
      isRequired,
      label,
      description,
      hasAlertIcon = true,
      hideMessage = false,
      ...props
    },
    ref
  ) => {
    const { error } = useFormField()

    const FormDescriptionNode = () => {
      if (description) {
        return typeof description === 'string' ? (
          <FormDescription>{description}</FormDescription>
        ) : (
          description
        )
      }

      return null
    }

    return (
      <FormItem>
        {label && <FormLabel asterisk={isRequired}>{label}</FormLabel>}
        <FormControl>
          <Input
            ref={ref}
            {...props}
            className={cn(error && 'border border-destructive')}
          />
        </FormControl>
        <FormDescriptionNode />
        {!hideMessage && <FormMessage />}
      </FormItem>
    )
  }
)

FormSimpleInput.displayName = 'FormSimpleInput'
