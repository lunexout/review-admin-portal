'use server'

import { isUniqueConstraintFailed } from '@/lib/prisma-errors'
import { authActionClient } from '@/lib/safe-action'
import { prisma } from '@/server/prisma'
import { revalidatePath } from 'next/cache'
import { businessFormSchema } from '../model/business-form-schema'

export const actionCreateBusiness = authActionClient
  .schema(businessFormSchema)
  .metadata({ permission: 'access:admin-portal' })
  .action(
    async ({
      parsedInput: { name, description, services, types, addresses, priceTier }
    }) => {
      try {
        const business = await prisma.business.create({
          data: {
            name,
            description,
            services,
            priceTier,
            types,
            addresses: {
              createMany: {
                data: addresses.map((locatiom) => ({
                  address: locatiom.address,
                  latitude: locatiom.latitude,
                  longitude: locatiom.longitude,
                  googleMapUrl: locatiom.googleMapUrl
                }))
              }
            }
          }
        })

        revalidatePath('/admin/businesses', 'layout')

        return {
          created: true,
          id: business.id
        }
      } catch (error) {
        if (isUniqueConstraintFailed(error, 'Business', 'name')) {
          return {
            created: false,
            reason: 'unique_constraint_failed:[name]',
            message: 'A business with the same name already exists.'
          }
        }

        throw error
      }
    }
  )
