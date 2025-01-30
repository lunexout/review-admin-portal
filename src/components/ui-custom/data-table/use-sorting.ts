import { useDeepCompareMemo } from '@/lib/use-deep-compare-memo'
import { type SortingState } from '@tanstack/react-table'
import { parseAsJson, useQueryState } from 'nuqs'
import type { TransitionStartFunction } from 'react'
import { z } from 'zod'

const sortingSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean()
  })
)

export const useSorting = (
  defaultSorting: SortingState,
  key: string = 'sorting',
  {
    shallow = true,
    startTransition
  }: {
    shallow?: boolean
    startTransition?: TransitionStartFunction
  } = {}
) => {
  const [sorting, setSorting] = useQueryState(
    key,
    parseAsJson(sortingSchema.parse).withDefault(defaultSorting).withOptions({
      shallow,
      startTransition
    })
  )

  const memoizedSorting = useDeepCompareMemo(() => sorting, [sorting])

  return [memoizedSorting, setSorting] as const
}

export type UseSorting = {
  sorting: ReturnType<typeof useSorting>[0]
  setSorting: ReturnType<typeof useSorting>[1]
}
