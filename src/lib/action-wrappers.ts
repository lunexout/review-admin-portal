import { type Schema, type TypeOf } from 'zod'

import { toast } from 'sonner'

type MaybePromise<T> = Promise<T> | T

type OnSuccessIn<S extends Schema | undefined, Data> = (
  result: Data,
  input: S extends Schema ? TypeOf<S> : undefined
) => MaybePromise<void>

type OnSuccessOut<S extends Schema | undefined, Data> = (args: {
  data?: Data
  input: S extends Schema ? TypeOf<S> : undefined
}) => MaybePromise<void>

// TODO: Type of Data parameter is not inferred, so `input` is always undefined.
export const onSuccess = <S extends Schema | undefined, Data>(
  _onSuccess?: OnSuccessIn<S, Data>
): OnSuccessOut<S, Data> => {
  return ({ input, data }) => {
    // `data` can be undefined if server action throws `redirect` or similar function that causes Next.js to handle it under the hood.
    if (data) {
      return _onSuccess?.(data, input)
    }
  }
}

// TODO: Translate errors.
export const commonActionErrorHandler = ({
  error
}: {
  error: any
  input: any
}) => {
  if (error?.fetchError) {
    if (process.env.NODE_ENV === 'development') {
      toast.error(error.fetchError)
    } else {
      toast.error('Network error. Please try again later.')
    }
    return
  }

  if (error?.serverError) {
    toast.error(error.serverError)
    return
  }

  if (error?.validationErrors) {
    if (process.env.NODE_ENV === 'development') {
      toast.error('Validation errors, something went wrong')
      console.log(error?.validationErrors)
    } else {
      toast.error('Internal server error.')
    }
  }
}
