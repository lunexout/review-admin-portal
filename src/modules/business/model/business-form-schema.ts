import {
  BusinessPriceTier as PBusinessPriceTier,
  BusinessService as PBusinessService,
  BusinessType as PBusinessType
} from '@prisma/client'
import { z } from 'zod'
import { descriptionMaxLength, nameMaxLength } from '../../shared/schema'

export type BusinessFormSchemaInput = z.input<typeof businessFormSchema>
export type BusinessFormSchema = z.infer<typeof businessFormSchema>

const BusinessType = z.enum([PBusinessType.SALON])
const BusinessService = z.enum([
  PBusinessService.BEARD,
  PBusinessService.EPILATION,
  PBusinessService.EYEBROW_EYELASH,
  PBusinessService.HAIR,
  PBusinessService.NAIL,
  PBusinessService.PIERCING,
  PBusinessService.POTOX,
  PBusinessService.TATTOO
])
const BusinessPriceTier = z.enum([
  PBusinessPriceTier.LOW,
  PBusinessPriceTier.NORMAL,
  PBusinessPriceTier.HIGH,
  PBusinessPriceTier.LUXURY
])

// Zod schema for BusinessAddress
const BusinessAddressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180)
    .max(180, 'Longitude must be between -180 and 180'),
  googleMapUrl: z.string().url().optional()
})

export const businessFormSchema = z.object({
  name: z.string().trim().min(1).max(nameMaxLength),
  description: z
    .string()
    .trim()
    .max(descriptionMaxLength)
    .transform((value) => value || null),
  types: z.array(BusinessType).min(1, 'At least one business type is required'),
  services: z
    .array(BusinessService)
    .min(1, 'At least one business service is required'),
  priceTier: z
    .array(BusinessPriceTier)
    .min(1, 'At least one price is required'),
  addresses: z
    .array(BusinessAddressSchema)
    .min(1, 'At least one business address is required')
})
