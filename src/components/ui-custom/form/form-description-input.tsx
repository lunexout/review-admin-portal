import { useTranslations } from 'next-intl'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
} from '@/components/ui/form'
import { Textarea, type TextareaProps } from '@/components/ui/textarea'

const maxInputLength = 1000

export const FormDescriptionInput = forwardRef<
  HTMLTextAreaElement,
  TextareaProps & { label: string; hideMessage?: boolean }
>(({ label, hideMessage, ...props }, ref) => {
  const { error } = useFormField()

  const t = useTranslations('FormDescriptionInput')

  const inputLength = typeof props.value === 'string' ? props.value.length : 0

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Textarea
          ref={ref}
          rows={5}
          className={cn('resize-none', {
            'border-destructive': error !== undefined
          })}
          {...props}
        />
      </FormControl>
      <FormDescription
        className={cn('ml-auto text-right text-xs', {
          'text-destructive': inputLength > maxInputLength
        })}
      >
        {t('characters_used', {
          input: inputLength,
          max: maxInputLength
        })}
      </FormDescription>
      {!hideMessage && <FormMessage />}
    </FormItem>
  )
})

FormDescriptionInput.displayName = 'FormDescriptionInput'
