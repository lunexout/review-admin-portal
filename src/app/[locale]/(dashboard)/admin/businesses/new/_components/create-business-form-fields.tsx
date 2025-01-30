import { useTranslations } from 'next-intl'
import type { UseFormReturn } from 'react-hook-form'

import { FormSimpleInput } from '@/components/ui-custom/form/form-simple-input'
import { GoogleMapAddressPicker } from '@/components/ui-custom/map/google-map-address-picker'
import { GoogleMapProvider } from '@/components/ui-custom/map/google-map-provider'
import { TextAreaDescription } from '@/components/ui-custom/textarea-description'
import { FormField } from '@/components/ui/form'
import { SelectBusinessPriceTiers } from '@/modules/business/components/select-business-price-tier'
import { SelectBusinessServices } from '@/modules/business/components/select-business-services'
import { SelectBusinessTypes } from '@/modules/business/components/select-business-types'
import { BusinessFormSchemaInput } from '@/modules/business/model/business-form-schema'
import { descriptionMaxLength } from '@/modules/shared/schema'

export const BusinessFormFields = ({
  form
}: {
  form: UseFormReturn<BusinessFormSchemaInput>
}) => {
  const t = useTranslations('BusinessFormFields')

  const description = form.watch('description')

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormSimpleInput
            label={t('field_label_name')}
            {...field}
            isRequired
          />
        )}
      />

      <FormField
        control={form.control}
        name="types"
        render={({ field }) => (
          <SelectBusinessTypes
            selectedTypes={field.value}
            onChangeTypes={field.onChange}
          />
        )}
      />

      <div className="flex gap-2 w-full">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <SelectBusinessServices
                selectedServices={field.value}
                onChangeServices={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex-1">
          <FormField
            control={form.control}
            name="priceTier"
            render={({ field }) => (
              <SelectBusinessPriceTiers
                selectedPriceTiers={field.value}
                onChangePriceTiers={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <FormField
        control={form.control}
        name="description"
        render={({ field, fieldState: { error } }) => (
          <TextAreaDescription
            {...field}
            label={t('field_label_description')}
            isRequired={false}
            error={
              description.length > descriptionMaxLength || error !== undefined
            }
            count={`${description.length}/${descriptionMaxLength}`}
          />
        )}
      />
      <div className="mt-4">
        <GoogleMapProvider>
          <GoogleMapAddressPicker
            onAdressPick={(address) => {
              form.setValue('addresses', [address])
            }}
          />
        </GoogleMapProvider>
      </div>
    </>
  )
}
