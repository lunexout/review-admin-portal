import { useTranslations } from 'next-intl'
import * as React from 'react'

import { cn } from '@/lib/utils'

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import { StateUpdateHandler } from '@/lib/handy-types'
import {
  FilterGroupList,
  FilterReset,
  FilterTrigger,
  type FilterOption
} from '../data-table/data-table-faceted-filter-reusable'

interface FormFacetedFilter {
  options: Array<FilterOption>
  onFilterChange: StateUpdateHandler<Array<string>>
  selectedValues: Set<string>
  title?: string
  size?: 'sm' | 'lg'
  disabled?: boolean
}

export function FormFacetedFilter({
  options,
  onFilterChange,
  title,
  selectedValues,
  size = 'sm',
  disabled
}: FormFacetedFilter) {
  const t = useTranslations('DataTableFacetedFilter')

  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size={size === 'sm' ? 'sm' : 'default'}
          className={cn('pl-2 pr-3', {
            'h-8': size === 'sm'
          })}
        >
          <FilterTrigger
            title={title}
            options={options}
            selectedValues={selectedValues}
            size={size}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <Command className="max-h-[308px]">
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t('no_results_found')}</CommandEmpty>
            <FilterGroupList
              options={options}
              selectedValues={selectedValues}
              onFilterChange={(value) => onFilterChange(value ?? [])}
            />
          </CommandList>
          {selectedValues && selectedValues.size > 0 && (
            <FilterReset
              onReset={() => {
                onFilterChange([])
                setIsOpen(false)
              }}
            />
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
