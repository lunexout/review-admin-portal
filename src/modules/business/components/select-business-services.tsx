import { useTranslations } from 'next-intl'

import {
  MultiSelect,
  option
} from '@/components/ui-custom/form/multiple-select'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { BusinessService } from '@prisma/client'

export const serviceOptions = [
  {
    id: BusinessService.HAIR,
    name: 'hair'
  },
  {
    id: BusinessService.BEARD,
    name: 'beard'
  },
  {
    id: BusinessService.EPILATION,
    name: 'epilation'
  },
  {
    id: BusinessService.NAIL,
    name: 'nail'
  },
  {
    id: BusinessService.PIERCING,
    name: 'piercing'
  },
  {
    id: BusinessService.TATTOO,
    name: 'tattoo'
  },
  {
    id: BusinessService.EYEBROW_EYELASH,
    name: 'eyebrow_eyelash'
  },
  {
    id: BusinessService.POTOX,
    name: 'potox'
  }
]

export const SelectBusinessServices = ({
  selectedServices,
  onChangeServices,
  hasAllOption
}: {
  selectedServices: Array<string>
  onChangeServices: (values: Array<string>) => void
  hasAllOption?: boolean
}) => {
  const t = useTranslations('SelectBusinessServices')

  return (
    <FormItem>
      <FormLabel asterisk>{t('services')}</FormLabel>
      <MultiSelect
        hasAllOption={hasAllOption}
        options={serviceOptions.map((service) =>
          option(service.id, t(service.name), {
            searchValue: t(service.name)
          })
        )}
        selected={selectedServices}
        onChange={onChangeServices}
        placeholder={t('placeholder')}
      />
      <FormMessage />
    </FormItem>
  )
}
