'use client'

import { DataTableColumnHeader } from '@/components/ui-custom/data-table/data-table-column-header'
import { DisplayDateTime } from '@/components/ui-custom/display-date'
import NoSSR from '@/lib/no-ssr'
import { BusinessTableRow } from '@/modules/business/queries/get-all-businesses'
import { Link } from '@/navigation'
import { BusinessPriceTier, BusinessService } from '@prisma/client'
import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { BusinessPriceBadges } from './badges/business-price-badges'
import { BusinessServiceBadges } from './badges/business-service-badges'
import { BusinessTypeBadges } from './badges/business-type-badges'
import { BusinessAddressPreview } from './business-address-drawer'

export const columnIds = {
  name: 'name',
  types: 'types',
  services: 'services',
  prices: 'prices',
  addresses: 'addresses',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
} as const

const columnHelper = createColumnHelper<BusinessTableRow>()

export const columnBusinessName = columnHelper.accessor('name', {
  id: columnIds.name,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return (
      <div className="font-medium">
        <div className="flex items-center gap-x-2 px-2 py-[2px]">
          {row.original.icon ? (
            <Image
              src={row.original.icon}
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
            href={`/admin/businesses/${row.original.id}/information`}
            className="hover:underline"
          >
            {row.original.name}
          </Link>
        </div>
      </div>
    )
  }
})

export const columnBusinessTypes = columnHelper.accessor('types', {
  id: columnIds.types,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return <BusinessTypeBadges types={row.original.types} />
  }
})

export const columnBusinessAddress = columnHelper.accessor('addresses', {
  id: columnIds.addresses,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return <BusinessAddressPreview address={row.original.addresses[0]} />
  }
})

export const columnBusinessServices = columnHelper.accessor('services', {
  id: columnIds.services,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return <BusinessServiceBadges services={row.original.services} />
  },
  getUniqueValues: (row) => {
    return row.services
  },
  filterFn: (row, columnId, filterValue: Array<BusinessService>) => {
    const services = row.getValue(columnId) as Array<BusinessService>

    if (filterValue.length === 0) {
      return true
    }

    return filterValue.some((service) => services.includes(service))
  }
})

export const columnBusinessPrices = columnHelper.accessor('priceTier', {
  id: columnIds.prices,
  enableHiding: false,
  enableSorting: true,
  header: DataTableColumnHeader,
  cell: ({ row }) => {
    return <BusinessPriceBadges prices={row.original.priceTier} />
  },
  getUniqueValues: (row) => {
    return row.priceTier
  },
  filterFn: (row, columnId, filterValue: Array<BusinessPriceTier>) => {
    const services = row.getValue(columnId) as Array<BusinessPriceTier>

    if (filterValue.length === 0) {
      return true
    }

    return filterValue.some((service) => services.includes(service))
  }
})

export const columnBusinessCreatedAt = columnHelper.accessor('createdAt', {
  id: columnIds.createdAt,
  header: DataTableColumnHeader,
  cell: ({ getValue }) => <NoSSR>{<DisplayDateTime date={getValue()} />}</NoSSR>
})

export const columnBusinessUpdatedAt = columnHelper.accessor('updatedAt', {
  id: columnIds.updatedAt,
  header: DataTableColumnHeader,
  cell: ({ getValue }) => <NoSSR>{<DisplayDateTime date={getValue()} />}</NoSSR>
})

export const columns = [
  columnBusinessName,
  columnBusinessServices,
  columnBusinessPrices,
  columnBusinessTypes,
  columnBusinessAddress,

  columnBusinessCreatedAt,
  columnBusinessUpdatedAt
]
