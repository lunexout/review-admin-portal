import { type Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export class PrismaTransactionError<const C extends string, T> extends Error {
  code: C
  meta?: T

  constructor(code: C, message: string, meta?: T) {
    super(message)
    this.code = code
    this.name = 'PrismaTransactionError'
    this.meta = meta
  }
}

/**
 * The generated location in Prisma that contains the models and fields.
 */
type TypeMapModels = Prisma.TypeMap['model']

/**
 * Extracts the model names from the Prisma type map.
 */
type ModelNames = keyof TypeMapModels

/**
 * Uses the Prisma type map to extract the field names for a given model.
 */
type FieldNames<T extends ModelNames> = T extends string
  ? keyof TypeMapModels[T]['fields']
  : never

export const isUniqueConstraintFailedUnsafe = (
  error: unknown,
  modelName: ModelNames,
  fieldName: FieldNames<ModelNames>
) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (
      error.code === 'P2002' &&
      error.meta?.modelName === modelName &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes(fieldName)
    ) {
      return true
    }
  }

  return false
}

export const isUniqueConstraintFailed = <Model extends ModelNames>(
  error: unknown,
  modelName: Model,
  fieldName: FieldNames<Model>
) => {
  return isUniqueConstraintFailedUnsafe(error, modelName, fieldName)
}

export const isForeignKeyConstraintFailed = <
  Model extends ModelNames,
  ForeignModel extends ModelNames
>(
  error: unknown,
  modelName: Model,
  foreignModelName: ForeignModel,
  foreignFieldName: FieldNames<ForeignModel>
) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (
      error.code === 'P2003' &&
      error.meta?.modelName === modelName &&
      typeof error.meta?.field_name === 'string' &&
      error.meta.field_name.includes(`${foreignModelName}_${foreignFieldName}`)
    ) {
      return true
    }
  }

  return false
}
