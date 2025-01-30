import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { ReactNode } from 'react'

interface DrawerProps {
  trigger: ReactNode
  title: string
  description?: string
  children: React.ReactNode // Dynamic content inside the drawer
}

export const ReusableSheet = ({ trigger, title, children }: DrawerProps) => {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent className="min-w-[700px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div>{children}</div>
      </SheetContent>
    </Sheet>
  )
}
