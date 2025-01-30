import {
  MultiSelect,
  option
} from '@/components/ui-custom/form/multiple-select'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { BusinessPriceTier } from '@prisma/client'
import { useTranslations } from 'next-intl'

export const priceTierOptions = [
  {
    id: BusinessPriceTier.LOW,
    name: 'low'
  },
  {
    id: BusinessPriceTier.NORMAL,
    name: 'normal'
  },
  {
    id: BusinessPriceTier.HIGH,
    name: 'high'
  },
  {
    id: BusinessPriceTier.LUXURY,
    name: 'luxury'
  }
]

export const SelectBusinessPriceTiers = ({
  selectedPriceTiers,
  onChangePriceTiers,
  hasAllOption
}: {
  selectedPriceTiers: Array<string>
  onChangePriceTiers: (values: Array<string>) => void
  hasAllOption?: boolean
}) => {
  const t = useTranslations('SelectBusinessPriceTiers')

  return (
    <FormItem>
      <FormLabel asterisk>{t('price_tiers')}</FormLabel>
      <MultiSelect
        hasAllOption={hasAllOption}
        options={priceTierOptions.map((service) =>
          option(service.id, t(service.name), {
            searchValue: t(service.name)
          })
        )}
        selected={selectedPriceTiers}
        onChange={onChangePriceTiers}
        placeholder={t('placeholder')}
      />
      <FormMessage />
    </FormItem>
  )
}
