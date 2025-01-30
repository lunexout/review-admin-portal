import { Button } from '@/components/ui/button'
import { Handler } from '@/lib/handy-types'
import { ReactNode } from 'react'

export type ControlIconEvents = {
  onClick?: Handler
  onTouchStart?: () => void
}

type ControlIconButtonProps = { icon: ReactNode } & ControlIconEvents

export const ControlIconButton = ({
  icon,
  onClick,
  onTouchStart
}: ControlIconButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-full"
      size="icon"
      onClick={onClick}
      onTouchStart={onTouchStart}
    >
      {icon}
    </Button>
  )
}
