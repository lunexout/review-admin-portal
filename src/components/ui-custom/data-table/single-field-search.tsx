import { type Column } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { SearchIcon } from 'lucide-react'
import { InputWithIcon } from '../input-with-icon'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const SingleFieldSearch = <TData,>({
  column,
  placeholder,
  autoFocus = false
}: {
  column?: Column<TData>
  placeholder?: string
  autoFocus?: boolean
}) => {
  const t = useTranslations('SingleFieldSearch')

  const columnRef = useRef(column)

  const value = (column?.getFilterValue() as string) ?? ''
  useEffect(() => {
    setState(value)
  }, [value])

  const [state, setState] = useState(value)
  const debouncedState = useDebounce(state, 300)

  useEffect(() => {
    columnRef.current?.setFilterValue(debouncedState)
  }, [debouncedState])

  return (
    <InputWithIcon
      placeholder={placeholder ?? t('search_by_name')}
      value={state}
      onChange={(event) => {
        const newValue = event.target.value
        setState(newValue)
      }}
      className="md:w-[330px] lg:w-[440px]"
      startIcon={SearchIcon}
      autoFocus={autoFocus}
    />
  )
}
