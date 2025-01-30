/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'

import { cn } from '@/lib/utils'

import { Input } from '../ui/input'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ComponentType<any>
  endIcon?: React.ComponentType<any>
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, startIcon: StartIcon, endIcon: EndIcon, ...props },
    ref
  ) => {
    return (
      <div className="relative">
        {StartIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <StartIcon
              className={cn('pointer-events-none size-4 text-muted-foreground')}
            />
          </div>
        )}
        {EndIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <EndIcon
              className={cn('pointer-events-none size-4 text-muted-foreground')}
            />
          </div>
        )}
        <Input
          type={type}
          className={cn(
            StartIcon ? 'pl-9' : '',
            EndIcon ? 'pr-9' : '',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
InputWithIcon.displayName = 'InputWithIcon'

export { InputWithIcon }
