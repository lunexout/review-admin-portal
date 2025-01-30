'use client'

import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export const UrlParamsToast = ({
  message,
  urlParamName
}: {
  message: string
  urlParamName: string
}) => {
  const [show, setShow] = useQueryState(
    urlParamName,
    parseAsBoolean.withOptions({
      history: 'replace',
      clearOnDefault: true
    })
  )

  const hasShown = useRef(false)

  useEffect(() => {
    if (show && !hasShown.current) {
      hasShown.current = true
      setShow(null)
      toast.success(message)
    }
  }, [show, message, setShow])

  return null
}
