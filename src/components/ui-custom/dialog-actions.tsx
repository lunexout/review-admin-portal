import { useTranslations } from 'next-intl'

import { AlertDialogCancel } from '@/components/ui/alert-dialog'
import { Button, type ButtonProps } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'

import { LoadingButton } from './loading-button'

export const DialogCloseButton = ({
  disabled,
  type = 'cancel'
}: {
  disabled: boolean
  type?: 'cancel' | 'close'
}) => {
  const t = useTranslations('DialogCloseButton')

  return (
    <DialogClose asChild>
      <Button variant="outline" disabled={disabled}>
        {type === 'cancel' ? t('cancel') : t('close')}
      </Button>
    </DialogClose>
  )
}

export const AlertDialogCancelButton = ({
  disabled,
  type = 'cancel'
}: {
  disabled: boolean
  type?: 'cancel' | 'close'
}) => {
  const t = useTranslations('AlertDialogCancelButton')

  return (
    <AlertDialogCancel disabled={disabled}>
      {type === 'cancel' ? t('cancel') : t('close')}
    </AlertDialogCancel>
  )
}

export const DialogSaveButton = ({
  isLoading,
  disabled,
  form
}: {
  isLoading: boolean
  disabled?: boolean
  form?: string
}) => {
  const t = useTranslations('DialogSaveButton')

  return (
    <LoadingButton
      isLoading={isLoading}
      loadingContent={t('saving')}
      type="submit"
      disabled={disabled}
      form={form}
    >
      {t('save')}
    </LoadingButton>
  )
}

export const DialogCreateButton = ({
  isLoading,
  disabled = false,
  onClick,
  label,
  variant,
  form
}: {
  isLoading: boolean
  disabled?: boolean
  onClick?: () => void
  label?: string
  variant?: ButtonProps['variant']
  form?: string
}) => {
  const t = useTranslations('DialogCreateButton')

  return (
    <LoadingButton
      disabled={disabled}
      isLoading={isLoading}
      loadingContent={label ? undefined : t('creating')}
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      variant={variant}
      form={form}
    >
      {label ?? t('create')}
    </LoadingButton>
  )
}

export const DialogDeleteButton = ({
  isDisabled,
  isLoading,
  onClick,
  label,
  loadingContent
}: {
  isDisabled?: boolean
  isLoading: boolean
  onClick?: () => void
  label?: string
  loadingContent?: string
}) => {
  const t = useTranslations('DialogDeleteButton')

  return (
    <LoadingButton
      disabled={isDisabled ?? false}
      variant="destructive"
      isLoading={isLoading}
      loadingContent={loadingContent ?? t('deleting')}
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
    >
      {label ?? t('delete')}
    </LoadingButton>
  )
}
