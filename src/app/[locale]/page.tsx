import { getTypedSession } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { getDefaultLoginRedirect } from '@/routes'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const session = await getTypedSession()

  console.log({ session })

  if (session === null) {
    return redirect('/sign-in')
  }

  const redirectUrl = getDefaultLoginRedirect(session.user.permissions)
  return redirect(redirectUrl)
}
