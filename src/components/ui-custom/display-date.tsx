'use client'

import { formatDate } from 'date-fns'

export const formatDateTime = (date: Date) => {
  return formatDate(date, 'd MMM yyyy, HH:mm')
}

export const DisplayDateTime = ({ date }: { date: Date }) => {
  return <span className="text-nowrap">{formatDateTime(date)}</span>
}

export const DisplayDate = ({
  date,
  format
}: {
  date: Date
  format?: string
}) => {
  return (
    <span className="text-nowrap">
      {formatDate(date, format ?? 'dd MMM yyyy')}
    </span>
  )
}
