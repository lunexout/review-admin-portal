'use client'

import { Tabs } from '@/components/ui-custom/tabs'
import { useSelectedLayoutSegment } from 'next/navigation'
import type { ReactNode } from 'react'

export const RouterTabs = ({ children }: { children: ReactNode }) => {
  const selectedSegment = useSelectedLayoutSegment()

  return (
    <Tabs defaultValue="information" value={selectedSegment ?? 'information'}>
      {children}
    </Tabs>
  )
}
