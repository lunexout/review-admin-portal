import { useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { sortBy } from 'remeda'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CommandGroup, CommandItem } from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { CheckIcon, PlusCircleIcon } from 'lucide-react'

export type FilterOption = {
  label: React.ReactNode
  value: string
  searchValue?: string
  icon?: React.ComponentType<{ className?: string }>
  exclusive?: boolean
  sticky?: boolean
  topCheckbox?: boolean
}

type FilterTriggerProps = {
  options: Array<FilterOption>
  size: 'sm' | 'lg'
  selectedValues: Set<string>
  title?: string
}

export const FilterTrigger = ({
  size,
  options,
  title,
  selectedValues
}: FilterTriggerProps) => {
  return (
    <Fragment>
      <PlusCircleIcon
        className={cn('mr-2 size-6 shrink-0', {
          'mr-1 size-4': size === 'sm'
        })}
      />
      {title}
      {selectedValues.size > 0 && (
        <>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Badge
            variant="secondary"
            className={cn('rounded-sm px-1 font-normal lg:hidden')}
          >
            {selectedValues.size}
          </Badge>
          <div className="hidden space-x-1 lg:flex">
            {selectedValues.size > 0 ? (
              <Badge
                variant="secondary"
                className={cn(
                  'flex min-w-5 items-center justify-center rounded-sm px-1 font-normal'
                )}
              >
                {selectedValues.size}
              </Badge>
            ) : (
              options
                .filter((option) => selectedValues.has(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="rounded-sm px-1 font-normal"
                  >
                    {option.label}
                  </Badge>
                ))
            )}
          </div>
        </>
      )}
    </Fragment>
  )
}

type FilterGroupListProps = {
  options: Array<FilterOption>
  selectedValues: Set<string>
  onFilterChange?: (value: Array<string> | undefined) => void
  facets?: Map<unknown, number>
  sortByNumberOfMatches?: boolean
}

export const FilterGroupList = ({
  options,
  selectedValues,
  onFilterChange,
  facets,
  sortByNumberOfMatches
}: FilterGroupListProps) => {
  const sortedOptions = sortByNumberOfMatches
    ? sortBy(options, [(option) => facets?.get(option.value) ?? 0, 'desc'])
    : options

  const sortBySticky = sortBy(sortedOptions, [
    (option) => option.sticky ?? false,
    'desc'
  ])

  return (
    <CommandGroup>
      {sortBySticky.map((option) => {
        const isSelected = selectedValues.has(option.value)

        return (
          <CommandItem
            key={option.value}
            className={cn({
              'flex items-start': option.topCheckbox
            })}
            value={
              option.searchValue ??
              (typeof option.label === 'string' ? option.label : option.value)
            }
            onSelect={() => {
              if (option.exclusive) {
                selectedValues.clear()
                if (!isSelected) {
                  selectedValues.add(option.value)
                }
              } else {
                const hasSelectedExclusive = options.some(
                  (option) =>
                    selectedValues.has(option.value) && option.exclusive
                )
                if (hasSelectedExclusive) {
                  selectedValues.clear()
                }

                if (isSelected) {
                  selectedValues.delete(option.value)
                } else {
                  selectedValues.add(option.value)
                }
              }

              const filterValues = Array.from(selectedValues)
              onFilterChange?.(filterValues.length ? filterValues : undefined)
            }}
          >
            <div
              className={cn(
                'mr-2 flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'opacity-50 [&_svg]:invisible',
                {
                  'mt-1.5': option.topCheckbox
                }
              )}
            >
              <CheckIcon className={cn('size-3')} />
            </div>
            {option.icon && (
              <option.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span className="mr-5 w-full">{option.label}</span>
            <span className="ml-auto mr-2 flex size-4 items-center justify-end font-mono text-xs">
              {facets?.get(option.value) ?? ''}
            </span>
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}

type FilterResetProps = {
  onReset: () => void
  label?: string
}

export const FilterReset = ({ label, onReset }: FilterResetProps) => {
  const t = useTranslations('DataTableFacetedFilter')

  return (
    <>
      <Separator />
      <div className="w-full p-1">
        <Button size="sm" variant="ghost" className="w-full" onClick={onReset}>
          {label ?? t('clear_filters')}
        </Button>
      </div>
    </>
  )
}
