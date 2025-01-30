'use client'

import { DataTableFacetedFilter } from '@/components/ui-custom/data-table/data-table-faceted-filter'
import { DataTableResetFiltersButton } from '@/components/ui-custom/data-table/data-table-reset-filters-button'
import { getFilterLabel } from '@/components/ui-custom/data-table/meta'
import { SingleFieldSearch } from '@/components/ui-custom/data-table/single-field-search'
import { Button } from '@/components/ui/button'
import { ScrollBar } from '@/components/ui/scroll-area'
import { priceTierOptions } from '@/modules/business/components/select-business-price-tier'
import { serviceOptions } from '@/modules/business/components/select-business-services'
import { Link } from '@/navigation'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { type Table } from '@tanstack/react-table'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { columnIds } from './businesses-column'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function BusinessesTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const t = useTranslations('BusinessesTableToolbar')

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <SingleFieldSearch
          column={table.getColumn(columnIds.name)}
          placeholder={t('search_placeholder')}
        />
        <Button variant="outline">
          <PlusIcon />
          <Link href="/admin/businesses/new">{t('create_business')}</Link>
        </Button>
      </div>
      <div className="flex w-full items-center space-x-4">
        <ScrollArea className="-mb-3 pb-3">
          <div className="flex w-full items-center space-x-2">
            {table.getColumn(columnIds.services) && (
              <DataTableFacetedFilter
                column={table.getColumn(columnIds.services)}
                title={getFilterLabel(table, columnIds.services)}
                sortByNumberOfMatches
                options={serviceOptions.map((service) => ({
                  label: t(`services.${service.name}`),
                  value: service.id
                }))}
              />
            )}
            {table.getColumn(columnIds.prices) && (
              <DataTableFacetedFilter
                column={table.getColumn(columnIds.prices)}
                title={getFilterLabel(table, columnIds.prices)}
                sortByNumberOfMatches
                options={priceTierOptions.map((price) => ({
                  label: t(`prices.${price.name}`),
                  value: price.id
                }))}
              />
            )}
          </div>
          <ScrollBar orientation="horizontal" className="z-10" />
        </ScrollArea>

        <DataTableResetFiltersButton table={table} />

        {/* <div className="flex-1">
            <DataTableViewOptions table={table} />
          </div> */}
      </div>
    </div>
  )
}
