'use client'

import { DataTable } from '@/components/ui-custom/data-table/data-table'
import { DataTablePagination } from '@/components/ui-custom/data-table/data-table-pagination'
import { useColumnFilters } from '@/components/ui-custom/data-table/use-column-filters'
import { useColumnVisibility } from '@/components/ui-custom/data-table/use-column-visibility'
import { usePagination } from '@/components/ui-custom/data-table/use-pagination'
import { useSorting } from '@/components/ui-custom/data-table/use-sorting'
import { createTypedTableMeta } from '@/lib/create-typed-table-meta'
import {
  BusinessTableRow,
  getAllBusinesses
} from '@/modules/business/queries/get-all-businesses'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { use } from 'react'
import { columnIds, columns } from './businesses-column'
import { BusinessesTableToolbar } from './businesses-table-toolbar'

interface DataTableProps {
  canManage: boolean
  dataPromise: ReturnType<typeof getAllBusinesses>
}

type Labels = {
  name: string
  types: string
  services: string
  prices: string
  addresses: string
  createdAt: string
  updatedAt: string
}

type FilterLabels = Labels & {}

export type BusinessesTableMeta = {
  canManage: boolean
  labels: Labels
  filterLabels: FilterLabels
}

export const businessesTableMeta = createTypedTableMeta<BusinessesTableMeta>()

export function BusinessesTable({ canManage, dataPromise }: DataTableProps) {
  const data = use(dataPromise)

  const t = useTranslations('BusinessesTable')

  const [pagination, setPagination] = usePagination()

  const [sorting, setSorting] = useSorting(
    [
      {
        id: columnIds.createdAt,
        desc: true
      }
    ],
    'c_sorting'
  )

  const [columnVisibility, setColumnVisibility] = useColumnVisibility({
    [columnIds.name]: true,
    [columnIds.types]: true,
    [columnIds.services]: true,
    [columnIds.addresses]: true,
    [columnIds.prices]: true,
    [columnIds.createdAt]: true,
    [columnIds.updatedAt]: false
  })

  const [columnFilters, setColumnFilters] = useColumnFilters([], 'c_filters')

  const columnOrder: string[] = [
    columnIds.name,
    columnIds.types,
    columnIds.services,
    columnIds.prices,
    columnIds.addresses,

    columnIds.createdAt,
    columnIds.updatedAt
  ]

  const labels: Labels = {
    [columnIds.name]: t('columns.name'),
    [columnIds.types]: t('columns.types'),
    [columnIds.services]: t('columns.services'),
    [columnIds.prices]: t('columns.prices'),
    [columnIds.addresses]: t('columns.addresses'),
    [columnIds.createdAt]: t('columns.created_at'),
    [columnIds.updatedAt]: t('columns.updated_at')
  }

  const filterLabels: FilterLabels = {
    ...labels
  }

  const table = useReactTable<BusinessTableRow>({
    data,
    columns,
    getRowId: (row) => row.id,

    meta: businessesTableMeta.createMeta({
      labels,
      filterLabels,

      canManage
    }),

    initialState: {
      columnOrder
    },

    state: {
      pagination,
      sorting,
      columnVisibility,
      columnFilters
    },

    // -- Pagination
    onPaginationChange: setPagination,
    autoResetPageIndex: false,

    // -- Sorting
    enableSorting: true,
    onSortingChange: setSorting,

    // -- Column visibility
    enableHiding: true,
    onColumnVisibilityChange: setColumnVisibility,

    // -- Column filters
    enableFilters: true,
    enableColumnFilters: true,
    onColumnFiltersChange: setColumnFilters,

    // -- Row models - https://tanstack.com/table/latest/docs/guide/row-models
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel()
  })

  // TODO
  // if (data.length === 0) {
  //   return (
  //     <NoTableData title="No classes created yet">
  //       {canManage && (
  //         <NoTableDataAction title="Press the button below to create a new class">
  //           {/* {createClassPopup} */}
  //         </NoTableDataAction>
  //       )}
  //     </NoTableData>
  //   )
  // }

  return (
    <div className="grid grid-cols-1 gap-y-4">
      <BusinessesTableToolbar table={table} />
      <DataTable table={table} negativeHeight={393} />
      <DataTablePagination table={table} />
    </div>
  )
}
