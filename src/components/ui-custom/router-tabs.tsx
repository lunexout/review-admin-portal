'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import type { ReactNode } from 'react'

import { Tabs } from '@/components/ui-custom/tabs'

export const RouterTabs = ({
  children,
  defaultTab
}: {
  children: ReactNode
  defaultTab: string
}) => {
  const selectedSegment = useSelectedLayoutSegment()

  return (
    <Tabs
      asChild
      defaultValue={defaultTab}
      value={selectedSegment ?? defaultTab}
    >
      {children}
    </Tabs>
  )
}
