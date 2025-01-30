import { ensurePermission } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { CreateBusinessForm } from './_components/create-business-form'

export default async function Page() {
  await ensurePermission('access:admin-portal')

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/businesses">
        <Button variant="outline">
          <ArrowLeftIcon />
          Back
        </Button>
      </Link>
      <CreateBusinessForm />
    </div>
  )
}
