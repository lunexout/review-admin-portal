import { ReactNode, Suspense } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb'
import { Separator } from './ui/separator'
import { SidebarInset, SidebarTrigger } from './ui/sidebar'

export const AppSidebarBreadcrumbs = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList id="breadcrumb-portal">
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/businesses">
                Businesses
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                Create new business
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <Suspense
        fallback={
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        }
      >
        <div className="p-4">{children}</div>
      </Suspense>
    </SidebarInset>
  )
}
