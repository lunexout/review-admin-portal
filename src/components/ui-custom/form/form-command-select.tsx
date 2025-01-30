import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import type { OptionType } from '@/components/ui-custom/form/multiple-select'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export const FormCommandSelect = ({
  modal,
  isDisabled,
  isRequired,
  options,
  value,
  onChange,
  noValueId = '',
  noValueLabel,
  placeholder,
  searchPlaceholder,
  label,
  emptyLabel,
  customSelectedValue,
  className,
  hideCheckIcon = false,
  hideMessage = false
}: {
  modal?: boolean
  isDisabled?: boolean
  isRequired: boolean
  options: Array<OptionType>
  value: string
  onChange: (value: OptionType) => void
  noValueId?: string
  noValueLabel: ReactNode
  placeholder: ReactNode
  searchPlaceholder: string
  label?: ReactNode
  emptyLabel: ReactNode
  customSelectedValue?: ReactNode
  hideCheckIcon?: boolean
  className?: string
  hideMessage?: boolean
}) => {
  const { error } = useFormField()

  const [isOpen, setIsOpen] = useState(false)

  if (!isRequired) {
    options =
      value === ''
        ? options
        : [{ value: noValueId, label: noValueLabel }, ...options]
  }

  const selectedValue =
    value !== noValueId
      ? options.find((option) => option.value === value)
      : null

  return (
    <FormItem>
      {label && <FormLabel asterisk={isRequired}>{label}</FormLabel>}
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={modal}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              disabled={isDisabled}
              variant="outline"
              role="combobox"
              className={cn(
                'w-full justify-between rounded-lg px-3 text-base font-normal',
                className,
                {
                  'border-destructive': error !== undefined
                }
              )}
            >
              {selectedValue ? (
                <span className="truncate font-medium">
                  {customSelectedValue ?? selectedValue.label}
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn('min-w-[var(--radix-popover-trigger-width)] p-0', {})}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    style={{
                      wordBreak: 'break-word'
                    }}
                    className={cn('max-w-full text-wrap break-words', {
                      'text-muted-foreground': option.value === noValueId
                    })}
                    disabled={option.disabled}
                    value={
                      option.searchValue ??
                      (typeof option.label === 'string'
                        ? option.label
                        : option.value)
                    }
                    onSelect={() => {
                      onChange(option)
                      setIsOpen(false)
                    }}
                  >
                    {!hideCheckIcon && (
                      <CheckIcon
                        className={cn(
                          'mr-2 size-3 shrink-0',
                          option.value === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    )}
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {!hideMessage && <FormMessage />}
    </FormItem>
  )
}
