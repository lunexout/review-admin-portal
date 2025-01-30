'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'

import { PreventNavigation } from '@/lib/prevent-navigation'

import { FormErrorAlert } from '@/components/ui-custom/form/form-error-alert'
import { LoadingButton } from '@/components/ui-custom/loading-button'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { commonActionErrorHandler, onSuccess } from '@/lib/action-wrappers'
import { actionCreateBusiness } from '@/modules/business/actions/action-create-business'
import {
  BusinessFormSchemaInput,
  businessFormSchema
} from '@/modules/business/model/business-form-schema'
import { Link } from '@/navigation'
import { toast } from 'sonner'
import { BusinessFormFields } from './create-business-form-fields'

export const CreateBusinessForm = () => {
  const t = useTranslations('CreateBusinessForm')

  const $actionCreateBusiness = useAction(actionCreateBusiness, {
    onSuccess: onSuccess((result) => {
      if (result.created) {
        toast.success('Business created.')
      }
    }),
    onError: commonActionErrorHandler
  })

  const form = useForm<BusinessFormSchemaInput>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      description: '',
      priceTier: [],
      types: [],
      services: [],
      addresses: []
    }
  })

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            const values = form.getValues()

            $actionCreateBusiness.execute(values)
          })}
          className="flex flex-col gap-y-4 max-w-screen-md"
        >
          <BusinessFormFields form={form} />

          <FormErrorAlert
            status={$actionCreateBusiness.status}
            errorCondition={
              $actionCreateBusiness.result.data?.created === false
            }
            errorMessage={
              $actionCreateBusiness.result.data?.reason
                ? t(`errors.${$actionCreateBusiness.result.data.reason}`)
                : undefined
            }
          />

          <div className="flex justify-between">
            <Link href="/admin/businesses">
              <Button
                disabled={$actionCreateBusiness.isPending}
                variant="outline"
              >
                Cancel
              </Button>
            </Link>
            <LoadingButton
              isLoading={$actionCreateBusiness.isPending}
              loadingContent={t('creating_business')}
              type="submit"
            >
              {t('create')}
            </LoadingButton>
          </div>
        </form>
      </Form>

      <PreventNavigation
        when={form.formState.isDirty && !form.formState.isSubmitSuccessful}
      />
    </>
  )
}
