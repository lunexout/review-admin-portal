'use client'

import { DataTable } from '@/components/ui-custom/data-table/data-table'
import { DataTablePagination } from '@/components/ui-custom/data-table/data-table-pagination'
import { useColumnFilters } from '@/components/ui-custom/data-table/use-column-filters'
import { useColumnVisibility } from '@/components/ui-custom/data-table/use-column-visibility'
import { usePagination } from '@/components/ui-custom/data-table/use-pagination'
import { useSorting } from '@/components/ui-custom/data-table/use-sorting'
import { createTypedTableMeta } from '@/lib/create-typed-table-meta'
import {
  UserTableRow,
  getAllUsers
} from '@/modules/users/queries/get-all-users'
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
import { columnIds, columns } from './users-column'
import { UsersTableToolbar } from './users-table-toolbar'

interface DataTableProps {
  canManage: boolean
  dataPromise: ReturnType<typeof getAllUsers>
}

type Labels = {
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

type FilterLabels = Labels & {}

export type UsersTableMeta = {
  canManage: boolean
  labels: Labels
  filterLabels: FilterLabels
  // coreCourseOptions: Awaited<ReturnType<typeof getCoreCourseOptions>>
  // role: UserRole
  // courseId: string | null
  // interfaceVariant: InterfaceVariant
  // zoomHostKeys?: ZoomHostKeys
}

export const usersTableMeta = createTypedTableMeta<UsersTableMeta>()

export function UsersTable({ canManage, dataPromise }: DataTableProps) {
  const data = use(dataPromise)

  const t = useTranslations('UsersTable')

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
    [columnIds.email]: true,
    [columnIds.role]: true,
    [columnIds.status]: true,
    [columnIds.createdAt]: true
  })

  const [columnFilters, setColumnFilters] = useColumnFilters([], 'c_filters')

  const columnOrder: string[] = [
    columnIds.name,
    columnIds.email,
    columnIds.role,
    columnIds.status,
    columnIds.createdAt
  ]

  const labels: Labels = {
    [columnIds.name]: t('columns.name'),
    [columnIds.email]: t('columns.email'),
    [columnIds.role]: t('columns.role'),
    [columnIds.status]: t('columns.status'),
    [columnIds.createdAt]: t('columns.created_at')
  }

  const filterLabels: FilterLabels = {
    ...labels
  }

  const table = useReactTable<UserTableRow>({
    data,
    columns,
    getRowId: (row) => row.id,

    meta: usersTableMeta.createMeta({
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
  // if (data.length !== 0) {
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
      <UsersTableToolbar table={table} />
      <DataTable table={table} negativeHeight={393} />
      <DataTablePagination table={table} />
    </div>
  )
}
