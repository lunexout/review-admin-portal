import { z } from 'zod'

export const textSchema = z.string().trim()

const nullIfEmpty = (value: string) => (value === '' ? null : value)

export const descriptionMaxLength = 1000

export const descriptionSchema = textSchema
  .max(descriptionMaxLength)
  .transform(nullIfEmpty)

export const nameMaxLength = 80

export const nameSchema = textSchema
  .min(1, { message: 'Field is required' })
  .max(nameMaxLength)

export const emailSchema = z.string().email()

export const optionalFileKeySchema = z.union([
  z.literal('').transform(() => null),
  z.string().trim().max(100)
])

export const optionalDateSchema = z
  .string()
  .datetime()
  .or(z.literal(''))
  .transform((value) => (value === '' ? null : new Date(value)))

export const idSchema = z.string().cuid2({ message: 'Field is required' })
export const idSchemaWithMessage = (message: string) =>
  z.string().cuid2({ message: message })

export const optionalIdSchema = z.union([
  z.literal('').transform(() => null),
  idSchema
])

export const selectOptionSchema = z
  .string()
  .min(1, { message: 'Field is required' })
