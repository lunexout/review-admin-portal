import { prisma } from '@/server/prisma'

export type UserTableRow = Awaited<ReturnType<typeof getAllUsers>>[number]

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      role: true
    }
    // orderBy: {
    //   createdAt: 'desc'
    // }
    // You can add a select or include here to limit the returned fields
  })

  return users // This returns `Prisma.Business[]`
}
