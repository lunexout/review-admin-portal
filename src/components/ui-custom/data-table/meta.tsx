import type { Table } from '@tanstack/react-table'

export const getHeaderLabel = (table: Table<any>, key: string) => {
  return (table.options.meta as any).labels[key] ?? '??'
}

export const getFilterLabel = (table: Table<any>, key: string) => {
  return (table.options.meta as any).filterLabels[key] ?? '??'
}
