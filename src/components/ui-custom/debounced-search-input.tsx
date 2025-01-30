import { useEffect, useState } from 'react'

import { useEvent } from '@/lib/use-event'

import { useDebounce } from '@/components/ui-custom/data-table/single-field-search'
import { InputWithIcon } from '@/components/ui-custom/input-with-icon'
import { SearchIcon } from 'lucide-react'

export const DebouncedSearchInput = ({
  value,
  onChange,
  placeholder
}: {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
}) => {
  const onChangeEvent = useEvent(onChange)

  useEffect(() => {
    setState(value)
  }, [value])

  const [state, setState] = useState(value)
  const debouncedState = useDebounce(state, 300)

  useEffect(() => {
    onChangeEvent(debouncedState)
  }, [onChangeEvent, debouncedState])

  return (
    <InputWithIcon
      placeholder={placeholder ?? 'Search'}
      value={state}
      onChange={(event) => {
        const newValue = event.target.value
        setState(newValue)
      }}
      className="md:w-[330px] lg:w-[440px]"
      startIcon={SearchIcon}
    />
  )
}
