import { PrismaClient as BasePrismaClient } from '@prisma/client'
import cuid2Extension from 'prisma-extension-cuid2'

import { createOnce } from './create-once'
import { prismaWithoutExtensions } from './prisma-without-extension'

export const extendPrisma = (prismaWithoutExtensions: BasePrismaClient) => {
  return prismaWithoutExtensions.$extends(
    cuid2Extension({
      // The following tables don't have the `id` column, so we don't want the extension to generate it.
      excludeFields: ['Admin:id'],
      // Generate the `id` column as cuid2 for all other tables.
      includeFields: ['*:id']
    })
  )
}

export const prisma = createOnce('prisma', () => {
  return extendPrisma(prismaWithoutExtensions)
})

// Copied from https://github.com/prisma/prisma/issues/20738#issuecomment-1807917019
export type PrismaClient = typeof prisma
export type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0]
