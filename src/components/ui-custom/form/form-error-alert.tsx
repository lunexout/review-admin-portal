import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { MessageSquareWarningIcon } from 'lucide-react'

export const FormErrorAlert = ({
  status,
  errorCondition,
  errorMessage
}: {
  status: 'hasSucceeded' | (string & NonNullable<unknown>)
  errorCondition?: boolean | undefined
  errorMessage?: ReactNode | undefined
}) => {
  const t = useTranslations('FormErrorAlert')

  if (status === 'hasSucceeded' && errorCondition) {
    return (
      <Alert variant="destructive" className="py-2.5">
        <div className="flex items-center gap-x-2">
          <span>
            <MessageSquareWarningIcon className="size-5" />
          </span>
          <AlertTitle className="mb-0 text-sm font-medium">
            {errorMessage || t('general_error_message')}
          </AlertTitle>
        </div>
      </Alert>
    )
  }

  return null
}
