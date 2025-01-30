import type { Table } from '@tanstack/react-table'

export function createTypedTableMeta<TMeta>() {
  return {
    createMeta(meta: TMeta): TMeta {
      return meta
    },
    getMeta(table: Table<TMeta> | unknown): TMeta {
      return (table as Table<TMeta>).options.meta as TMeta
    }
  }
}

/**
 * How to use
  Firstly we declare type for table meta. It's up to you how to create type or interface.
  type CourseResourceTableMeta = {
    resourceCategoriesOptions: {
      id: string
      name: string
    }[]
  }
  ---------------------------------------------------------------
  Initiate function that will accept and return same type of meta

  export const courseResourceTableMeta = createTypedTableMeta<CourseResourceTableMeta>()
  ---------------------------------------------------------------
  Add meta value into useReactTable

  const table = useReactTable<CourseResourcesTableRow>({
    data: resourcesInCourse,
    columns,
    getRowId: (row) => row.id,

    meta: courseResourceTableMeta.createMeta({
      resourceCategoriesOptions,
    }),
    ...
  });
  ---------------------------------------------------------------
  In column get table and pass meta into `getMeta` function

  cell: ({ row, table }) => {
    const meta = courseResourceTableMeta.getMeta(table)
    const resourceCategoriesOptions = meta.resourceCategoriesOptions
  }
*/
