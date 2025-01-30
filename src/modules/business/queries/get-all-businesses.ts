import { prisma } from '@/server/prisma'

export type BusinessTableRow = Awaited<
  ReturnType<typeof getAllBusinesses>
>[number]

export const getAllBusinesses = async () => {
  const businesses = await prisma.business.findMany({
    include: {
      addresses: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return businesses
}
