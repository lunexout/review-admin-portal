'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Header, Row } from '@tanstack/react-table'
import { flexRender, type Table as TableType } from '@tanstack/react-table'
import { JSX, cloneElement, useCallback, useEffect } from 'react'

import { cn } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { DataTableRow } from './data-table-row'
import { NoResultsFound } from './internals/no-results-found'

export const getVisibleHeaderColumns = <TData,>(table: TableType<TData>) => {
  return table.getHeaderGroups().reduce((acc, headerGroup) => {
    const visibleHeaders = headerGroup.headers.filter((header) =>
      header.column.getIsVisible()
    ).length
    return acc + visibleHeaders
  }, 0)
}

export const DataTable = <TData,>({
  table,
  negativeHeight,
  baseMaxHeight = '100dvh',
  cellAlign = 'middle',
  renderSubComponent = undefined,
  isSubTable = false,
  BulkActions,
  showBulkRow,
  columnStyle,
  dense = false,
  semidense = false,
  whiteBackground = false,
  draggable = false,
  draggableAdditionalData = []
}: {
  table: TableType<TData>
  negativeHeight: number
  baseMaxHeight?: string
  cellAlign?: 'top' | 'middle'
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
  isSubTable?: boolean
  BulkActions?: JSX.Element
  showBulkRow?: boolean
  columnStyle?: Record<string, string>
  dense?: boolean
  semidense?: boolean
  whiteBackground?: boolean
  draggable?: boolean
  // In case you want some additional data from row, you can put fieldName here and will receive after drag/drop
  draggableAdditionalData?: Array<keyof Row<TData>['original']>
}) => {
  const { pagination, columnFilters } = table.getState()

  useEffect(() => {
    const el = document.querySelector('.data-table > div')
    if (el) {
      el.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pagination.pageIndex, columnFilters])

  const visibleHeaderColumns = getVisibleHeaderColumns(table)

  const renderHeader = useCallback(
    (header: Header<TData, unknown>, idx: number, totalHeaders: number) => {
      return (
        <TableHead
          key={header.id}
          colSpan={header.colSpan}
          style={{
            ...(isSubTable && {
              boxShadow: '0px 20px 14px -24px #00247A4D inset'
            })
          }}
          className={cn(
            'relative bg-custom-pageBackground font-semibold text-foreground dark:bg-background',
            {
              'sticky left-0 z-[3]': idx === 0,
              'sticky right-0 z-[3]': idx === totalHeaders - 1
            },
            'bg-gray-50 group-hover:bg-neutral-100 group-data-[state=selected]:bg-muted dark:group-hover:bg-neutral-900 dark:group-data-[state=selected]:bg-neutral-900',
            // Header cells of a sub-table
            {
              'bg-[#F2F6FB] group-hover:bg-[#E8F1FA]': isSubTable,
              'bg-white': whiteBackground
            },
            {
              'py-1': dense,
              'py-2': semidense
            },
            columnStyle && columnStyle[header.column.id]
          )}
        >
          {/* This explains what placeholder is: https://github.com/TanStack/table/discussions/4828 */}
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}

          {/* A border under the header row */}
          <div className="absolute inset-x-0 bottom-0 h-px w-full bg-border" />
        </TableHead>
      )
    },
    [columnStyle, dense, semidense, isSubTable, whiteBackground]
  )

  const tableHeaderGroups = table.getHeaderGroups()

  const tableHeaders = tableHeaderGroups.map((headerGroup) => (
    <TableRow
      key={headerGroup.id}
      className="group hover:bg-transparent data-[state=selected]:bg-transparent"
    >
      {headerGroup.headers.map((header, idx) => {
        return renderHeader(header, idx, headerGroup.headers.length)
      })}
    </TableRow>
  ))

  const firstHeader = renderHeader(
    tableHeaderGroups[0]!.headers[0]!,
    0,
    tableHeaderGroups[0]!.headers.length
  )

  const hasRows = table.getRowModel().rows.length > 0

  const tableRows =
    table.getRowModel().rows.length > 0 ? (
      table
        .getRowModel()
        .rows.map((row) => (
          <DataTableRow
            key={row.id}
            row={row}
            isSubTable={isSubTable}
            renderSubComponent={renderSubComponent}
            cellAlign={cellAlign}
            dense={dense}
            columnStyle={columnStyle}
            semidense={semidense}
            draggable={draggable}
            draggableAdditionalData={draggableAdditionalData.reduce(
              (prev, key) => ({ ...prev, [key]: row.original[key] }),
              {}
            )}
            visibleHeaderColumns={visibleHeaderColumns}
            whiteBackground={whiteBackground}
          />
        ))
    ) : (
      <NoResultsFound colSpan={visibleHeaderColumns} />
    )

  return (
    <div
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className={cn(
        // This class is needed only for imperative access in the `useEffect` above.
        'data-table',
        {
          'border-y': hasRows && !whiteBackground,
          'border-t': !hasRows && !whiteBackground,
          'border-b': whiteBackground
        },
        'flex h-full flex-1 flex-col overflow-auto'
      )}
      style={{
        maxHeight: `calc(${baseMaxHeight} - ${negativeHeight}px)`
      }}
    >
      <Table>
        <TableHeader
          className={cn('sticky top-0 z-10 [&_tr]:border-b-0', {
            'z-20': !isSubTable
          })}
        >
          {BulkActions && showBulkRow ? (
            <TableRow className="group w-full hover:bg-transparent data-[state=selected]:bg-transparent">
              {cloneElement(firstHeader, {
                className: cn(
                  'bg-[#E8F1FA] group-hover:bg-blue-100 group-data-[state=selected]:bg-muted dark:group-hover:bg-neutral-900 dark:group-data-[state=selected]:bg-neutral-900',
                  {
                    'sticky left-0 z-[3]': true
                  },
                  columnStyle &&
                    columnStyle[tableHeaderGroups[0]!.headers[0]!.column.id]
                )
              })}
              <TableHead
                colSpan={(table.getHeaderGroups()[0]?.headers.length ?? 0) - 1}
                className="bg-[#E8F1FA] group-hover:bg-blue-100 group-data-[state=selected]:bg-muted dark:group-hover:bg-neutral-900 dark:group-data-[state=selected]:bg-neutral-900"
              >
                {BulkActions}
              </TableHead>
            </TableRow>
          ) : (
            tableHeaders
          )}
        </TableHeader>

        <TableBody>
          {draggable ? (
            <SortableContext
              items={table
                .getRowModel()
                .rows.map((row) => (row.original as { id: string }).id)}
              strategy={verticalListSortingStrategy}
            >
              {tableRows}
            </SortableContext>
          ) : (
            tableRows
          )}
        </TableBody>
      </Table>
    </div>
  )
}
