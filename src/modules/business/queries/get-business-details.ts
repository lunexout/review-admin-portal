import { prisma } from '@/server/prisma'

export const getBusinessDetails = async (businessId: string) => {
  return await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      addresses: true
    }
  })
}
