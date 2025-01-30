import { type ColumnFiltersState } from '@tanstack/react-table'
import { parseAsJson, useQueryState } from 'nuqs'
import { useCallback, type TransitionStartFunction } from 'react'
import { z } from 'zod'

import { useDeepCompareMemo } from '@/lib/use-deep-compare-memo'
import { usePagination } from './use-pagination'

const filtersSchema = z.array(
  z.object({
    id: z.string(),
    value: z.any()
  })
)

export const useColumnFilters = (
  defaultFilters: ColumnFiltersState,
  key: string = 'filters',
  {
    shallow = true,
    startTransition
  }: { shallow?: boolean; startTransition?: TransitionStartFunction } = {}
) => {
  const [_pagination, setPagination] = usePagination({
    shallow,
    startTransition
  })

  const [columnFilters, _setColumnFilters] = useQueryState<ColumnFiltersState>(
    key,
    // @ts-expect-error `value: z.any()` is resolved to `value?: any` type instead of `value: any` required by ColumnFiltersState, causing a type error.
    parseAsJson(filtersSchema.parse).withDefault(defaultFilters).withOptions({
      shallow,
      startTransition
    })
  )

  const memoizedColumnFilters = useDeepCompareMemo(
    () => columnFilters,
    [columnFilters]
  )

  const setColumnFilters = useCallback(
    (value: any, options?: any) => {
      _setColumnFilters(value, options)
      setPagination({ pageIndex: 0 })
    },
    [_setColumnFilters, setPagination]
  )

  return [memoizedColumnFilters, setColumnFilters] as const
}

export type UseColumnFilters = {
  columnFilters: ReturnType<typeof useColumnFilters>[0]
  setColumnFilters: ReturnType<typeof useColumnFilters>[1]
}
