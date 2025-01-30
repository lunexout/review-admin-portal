import { type VisibilityState } from '@tanstack/react-table'
import { useState } from 'react'

export const useColumnVisibility = (
  defaultColumnVisibility: VisibilityState
) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility
  )

  return [columnVisibility, setColumnVisibility] as const
}
