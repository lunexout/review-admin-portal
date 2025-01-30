import { type Column } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
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

import {
  FilterGroupList,
  FilterReset,
  FilterTrigger,
  type FilterOption
} from './data-table-faceted-filter-reusable'

interface DataTableFacetedFilterProps<TData, TValue> {
  options: Array<FilterOption>
  column?: Column<TData, TValue>
  title?: string
  size?: 'sm' | 'lg'
  sortByNumberOfMatches?: boolean
  onChange?: (newFilters: string[]) => void
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  size = 'sm',
  sortByNumberOfMatches,
  onChange
}: DataTableFacetedFilterProps<TData, TValue>) {
  const t = useTranslations('DataTableFacetedFilter')

  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
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
      <PopoverContent align="start" className={cn('w-fit p-0', {})}>
        <Command className="max-h-[308px]">
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t('no_results_found')}</CommandEmpty>
            <FilterGroupList
              options={options}
              selectedValues={selectedValues}
              onFilterChange={(newValue) => {
                column?.setFilterValue(newValue)
                onChange?.(newValue ?? [])
              }}
              facets={facets}
              sortByNumberOfMatches={sortByNumberOfMatches}
            />
          </CommandList>
          {selectedValues.size > 0 && (
            <FilterReset
              onReset={() => {
                column?.setFilterValue(undefined)
                setIsOpen(false)
              }}
            />
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
