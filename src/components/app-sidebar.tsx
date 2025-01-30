import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import { AuthUser } from '@/auth/types/auth'
import {
  Building2Icon,
  Calendar,
  Search,
  Settings,
  Users2Icon
} from 'lucide-react'
import { ReactNode } from 'react'
import { AppSidebarBreadcrumbs } from './app-sidebar-breadcrumbs'
import { AppSidebarFooter } from './app-sidebar-footer'

// Menu items.
const items = [
  {
    title: 'Businesses',
    url: '/admin/businesses',
    icon: Building2Icon
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users2Icon
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar
  },
  {
    title: 'Search',
    url: '#',
    icon: Search
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

export function AppSidebar({
  user,
  children
}: {
  user: AuthUser
  children: ReactNode
}) {
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <AppSidebarFooter user={user} />
      </Sidebar>
      <AppSidebarBreadcrumbs>{children}</AppSidebarBreadcrumbs>
    </>
  )
}
