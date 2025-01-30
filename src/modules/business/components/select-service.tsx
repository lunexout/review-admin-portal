import { FormCommandSelect } from '@/components/ui-custom/form/form-command-select'
import { option } from '@/components/ui-custom/form/multiple-select'
import { useTranslations } from 'next-intl'

export const SelectService = ({
  users,
  selectedUserId,
  onChangeUserId
}: {
  users: Array<{
    id: string
    name: string | null
    email: string | null
    image: string | null
  }>
  selectedUserId: string
  onChangeUserId: (id: string) => void
}) => {
  const t = useTranslations('SelectService')

  return (
    <FormCommandSelect
      isRequired={false}
      label={t('label')}
      emptyLabel={t('empty_label')}
      noValueLabel={t('no_value_label')}
      placeholder={t('placeholder')}
      searchPlaceholder={t('search_placeholder')}
      value={selectedUserId}
      onChange={(option) => {
        onChangeUserId(option.value)
      }}
      options={users.map((user) =>
        option(
          user.id,
          <div className="flex items-center">
            {user.name ?? user.email ?? 'Unknown user'}
          </div>,
          { searchValue: user.name ?? undefined }
        )
      )}
    />
  )
}
