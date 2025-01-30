import { ensurePermission } from '@/auth/auth-react-bindings/auth-react-bindings-server'
import { DataTableSkeleton } from '@/components/ui-custom/data-table/data-table-skeleton'
import { getAllUsers } from '@/modules/users/queries/get-all-users'
import { Suspense } from 'react'
import { UsersTable } from './_components/users-table'

export default async function Page() {
  await ensurePermission('access:admin-portal')

  // const { hasPermission } = await ensurePermission('course:view')

  // const canManage = hasPermission('course:manage')
  // const canArchive = hasPermission('course:archive')

  const usersPromise = getAllUsers()

  // const coreClassesPromise = getAllClasses({
  //   hideArchived: !canArchive,
  //   type: CourseType.CORE
  // })
  // const gradeOptionsPromise = getCourseGradeOptions(false)
  // const coreCourseOptionsPromise = getCoreCourseOptions()

  return (
    <Suspense
      fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={3} />}
    >
      <UsersTable dataPromise={usersPromise} canManage />
    </Suspense>
  )
}
