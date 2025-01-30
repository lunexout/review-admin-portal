import { parseAsInteger, useQueryStates } from 'nuqs'
import type { TransitionStartFunction } from 'react'
import { z } from 'zod'

const defaultPageIndex = 0 as const

export const usePagination = ({
  shallow = true,
  startTransition
}: {
  shallow?: boolean
  startTransition?: TransitionStartFunction
} = {}) => {
  //TODO defaultPageSizeOption add
  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsInteger.withDefault(defaultPageIndex),
      pageSize: parseAsInteger.withDefault(25)
    },
    {
      clearOnDefault: true,
      shallow,
      startTransition
    }
  )

  const pageIndex = z
    .number()
    .int()
    .nonnegative()
    .catch(defaultPageIndex)
    .parse(pagination.pageIndex)
  const pageSize = z
    .number()
    .refine((value) => [25].includes(value))
    .catch(25)
    .parse(pagination.pageSize)

  return [{ pageIndex, pageSize }, setPagination] as const
}

export type UsePagination = {
  pagination: ReturnType<typeof usePagination>[0]
  setPagination: ReturnType<typeof usePagination>[1]
}
