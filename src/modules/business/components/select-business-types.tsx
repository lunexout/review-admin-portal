import { useTranslations } from 'next-intl'

import {
  MultiSelect,
  option
} from '@/components/ui-custom/form/multiple-select'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { BusinessService, BusinessType } from '@prisma/client'

export const types = [
  {
    id: BusinessService.HAIR,
    name: 'hair'
  }
]

export const SelectBusinessTypes = ({
  selectedTypes,
  onChangeTypes,
  hasAllOption
}: {
  selectedTypes: Array<string>
  onChangeTypes: (values: Array<string>) => void
  hasAllOption?: boolean
}) => {
  const t = useTranslations('SelectBusinessTypes')

  return (
    <FormItem>
      <FormLabel asterisk>{t('types')}</FormLabel>
      <MultiSelect
        hasAllOption={hasAllOption}
        options={[{ id: BusinessType.SALON, name: 'salon' }].map((service) =>
          option(service.id, t(service.name), {
            searchValue: t(service.name)
          })
        )}
        selected={selectedTypes}
        onChange={onChangeTypes}
        placeholder={t('placeholder')}
      />
      <FormMessage />
    </FormItem>
  )
}
