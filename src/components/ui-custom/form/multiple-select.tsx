import { ChevronsUpDown, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import * as React from 'react'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { FormControl, useFormField } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export type OptionType = {
  value: string
  label: React.ReactNode
  //
  searchValue?: string
  topCheckbox?: boolean
  disabled?: boolean
}

export const option = (
  value: string | number,
  label: ReactNode,
  params?: Omit<OptionType, 'value' | 'label'>
): OptionType => ({
  value: value.toString(),
  label,
  ...params
})

interface MultiSelectProps {
  options: OptionType[]
  selected: string[]
  onChange: (value: string[]) => void
  allOptions?: OptionType[]
  className?: string
  placeholder?: string
  disabled?: boolean
  hasAllOption?: boolean
  hasShowMore?: boolean
}

// TODO: [21] This component is not accessible (i.e. the input is <div> - you can focus it, but cannot open with the keyboard)
export const MultiSelect = ({
  allOptions,
  options,
  selected,
  onChange,
  className,
  placeholder,
  disabled = false,
  hasAllOption = false,
  hasShowMore = false,
  ...props
}: MultiSelectProps) => {
  // !This will work only in case MultiSelect is in inside the Form, otherwise it will cause error, currently all MultiSelects are into form
  // TODO: need to be adjusted in case we will have it outside of form somewhere
  const { error } = useFormField()

  allOptions = allOptions ?? options

  const t = useTranslations('MultiSelect')

  const [open, setOpen] = React.useState(false)

  //Is selected list expanded or collapsed
  const [fullListOpen, setFullListOpen] = React.useState(false)

  //Show button after content exceeds max-height
  const [showShowMoreButton, setShowShowMoreButton] = React.useState(false)

  const contentRef = React.useRef<HTMLDivElement | null>(null)

  // Check the height of the content to determine if the "Show More" button is needed
  React.useEffect(() => {
    if (contentRef.current && hasShowMore) {
      const contentHeight = contentRef.current.scrollHeight

      if (contentHeight >= 100) {
        setShowShowMoreButton(true)
      } else {
        setShowShowMoreButton(false)
      }
    }
  }, [selected, hasShowMore]) // Re-check the height when `selected` changes

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  return (
    <div className="flex flex-col gap-y-2.5">
      <Popover open={open} onOpenChange={setOpen} {...props} modal>
        <FormControl>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn('w-full justify-between rounded-lg !px-3', {
                'border-destructive': error !== undefined
              })}
              onClick={() => setOpen((prevOpen) => !prevOpen)}
              disabled={disabled}
            >
              <span className="text-base font-normal text-muted-foreground">
                {placeholder ?? t('select_options')}
              </span>
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent
          align="start"
          className="min-w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command className={className}>
            <CommandInput placeholder={t('search')} />
            <CommandEmpty>{t('no_item_found')}</CommandEmpty>
            <CommandList>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    className={cn('px-3', {
                      'flex items-start': option.topCheckbox
                    })}
                    value={
                      option.searchValue ??
                      (typeof option.label === 'string'
                        ? option.label
                        : option.value)
                    }
                    onSelect={() => {
                      onChange(
                        selected.includes(option.value)
                          ? selected.filter((item) => item !== option.value)
                          : [...selected, option.value]
                      )
                      setOpen(true)
                    }}
                  >
                    <Checkbox
                      className={cn('mr-3 shrink-0 border-border', {
                        'border-none': selected.includes(option.value),
                        'mt-1.5': option.topCheckbox
                      })}
                      checked={selected.includes(option.value)}
                    />
                    {/* <CheckIcon
                      className={cn(
                        'mr-2 size-3 shrink-0',
                        selected.includes(option.value) ? 'opacity-100' : 'opacity-0',
                      )}
                    /> */}
                    {/* TODO: Text overflows CommandItem when too long */}
                    <div className="break-words">{option.label}</div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="relative">
          <div
            ref={contentRef}
            className={cn('flex w-full flex-wrap gap-2.5', {
              'max-h-[100px] overflow-hidden': hasShowMore,
              'max-h-none': fullListOpen
            })}
          >
            {selected.map((itemId) => (
              <Badge
                key={itemId}
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                {allOptions?.find((o) => o.value === itemId)?.label}
                <button
                  disabled={disabled}
                  type="button"
                  className="ml-1 rounded-full text-primary outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(itemId)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleUnselect(itemId)
                  }}
                >
                  <XIcon className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
          {hasShowMore && showShowMoreButton && (
            <Button
              onClick={() => setFullListOpen((prev) => !prev)}
              type="button"
              variant="link"
              className="ml-0 pl-0 text-xs text-[#143176] underline"
            >
              {fullListOpen ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
