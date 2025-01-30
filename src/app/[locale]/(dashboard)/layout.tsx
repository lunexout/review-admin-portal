import { getUserSession } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getUserSession()

  if (!session) {
    return redirect('/sign-in')
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={session.user}>
        <main>{children}</main>
      </AppSidebar>
    </SidebarProvider>
  )
}
