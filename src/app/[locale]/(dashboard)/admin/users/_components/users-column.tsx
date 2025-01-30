'use client'

import { DataTableColumnHeader } from '@/components/ui-custom/data-table/data-table-column-header'
import { DisplayDateTime } from '@/components/ui-custom/display-date'
import { Badge } from '@/components/ui/badge'
import NoSSR from '@/lib/no-ssr'
import { UserStatusBadge } from '@/modules/users/components/users-status-badge'
import { UserTableRow } from '@/modules/users/queries/get-all-users'
import { Link } from '@/navigation'
import { UserStatus } from '@prisma/client'
import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'

export const columnIds = {
  name: 'name',
  email: 'email',
  role: 'role',
  status: 'status',
  createdAt: 'createdAt'
} as const

const columnHelper = createColumnHelper<UserTableRow>()

export const columnUserName = columnHelper.accessor('name', {
  id: columnIds.name,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return (
      <div className="font-medium">
        <div className="flex items-center gap-x-2 px-2 py-[2px]">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.name}
              width={24}
              height={24}
              className="rounded-full object-contain"
            />
          ) : (
            <div className="bg-white rounded-full flex items-center justify-center font-medium border size-[24px]">
              {row.original.name[0]}
              {row.original.name[1]}
            </div>
          )}

          <Link
            href={`/admin/users/${row.original.id}`}
            className="hover:underline"
          >
            {row.original.name}
          </Link>
        </div>
      </div>
    )
  }
})

export const columnUserEmail = columnHelper.accessor('email', {
  id: columnIds.email,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return <div className="font-medium">{row.original.email}</div>
  }
})

export const columnUserRole = columnHelper.accessor('role', {
  id: columnIds.role,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    if (!row.original.role) {
      return null
    }

    return <Badge variant="secondary">{row.original.role.name}</Badge>
  }
})

export const columnUserStatus = columnHelper.accessor('status', {
  id: columnIds.status,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return <UserStatusBadge userStatus={row.original.status} />
  },
  getUniqueValues: (row) => {
    return [row.status]
  },
  filterFn: (row, columnId, filterValue: Array<UserStatus>) => {
    const statuses = row.getValue(columnId) as Array<UserStatus>

    if (filterValue.length === 0) {
      return true
    }

    return filterValue.some((service) => statuses.includes(service))
  }
})

export const columnUserCreatedAt = columnHelper.accessor('createdAt', {
  id: columnIds.createdAt,
  header: DataTableColumnHeader,
  cell: ({ getValue }) => <NoSSR>{<DisplayDateTime date={getValue()} />}</NoSSR>
})

export const columns = [
  columnUserName,
  columnUserEmail,
  columnUserRole,
  columnUserStatus,
  columnUserCreatedAt
]
