import { prisma } from '@/server/prisma'

export const getBusinessAddresses = async () => {
  return await prisma.businessAddress.findMany({
    include: {
      business: true
    }
  })
}
