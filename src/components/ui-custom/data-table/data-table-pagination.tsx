import { type Table } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

export const pageSizeOptions = [10, 25, 50, 100] as const
export const defaultPageSizeOption = 25 as const

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table
}: DataTablePaginationProps<TData>) {
  const t = useTranslations('DataTablePagination')

  if (table.getPageCount() === 0) {
    return null
  }

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const totalRows = table.getRowCount()

  const startRowIndex = pageIndex * pageSize
  const endRowIndex = Math.min(startRowIndex + pageSize, totalRows)

  // const selectedRowsPerPage = `${table.getState().pagination.pageSize}`

  return (
    <div className="mt-2 flex items-center justify-end px-2">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/*
        TODO rows per page
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t('rows_per_page')}</p>
          <Select
            value={selectedRowsPerPage}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-fit">
              <SelectValue placeholder={table.getState().pagination.pageSize}>
                {selectedRowsPerPage}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <div className="flex min-w-[130px] items-center justify-center text-sm font-medium">
          {t('rows_of_total', {
            start: startRowIndex + 1,
            end: endRowIndex,
            total: totalRows
          })}
          {/* Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()} */}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('go_to_first_page')}</span>
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('go_to_previous_page')}</span>
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('go_to_next_page')}</span>
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('go_to_last_page')}</span>
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
