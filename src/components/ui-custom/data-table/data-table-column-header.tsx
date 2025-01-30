import type { Table } from '@tanstack/react-table'
import { type Column } from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpWideNarrowIcon
} from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getHeaderLabel } from './meta'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  column: Column<TData, TValue>
}

export function DataTableColumnHeader<TData, TValue>({
  table,
  column,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  const title = getHeaderLabel(table, column.id)

  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'pointer-events-none -ml-2 h-8 px-2 font-semibold',
          className
        )}
      >
        {title}
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'group/btn -ml-2 h-8 px-2 font-semibold hover:bg-black/5',
        className
      )}
      onClick={() => {
        column.toggleSorting()
      }}
    >
      <span>{title}</span>
      {column.getIsSorted() === 'desc' ? (
        <ArrowUpWideNarrowIcon className="ml-2 size-4" />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowDownIcon className="ml-2 size-4" />
      ) : (
        <ArrowUpDownIcon className="ml-2 size-4 opacity-0 transition-opacity group-hover/btn:opacity-100" />
      )}
    </Button>
  )
}
