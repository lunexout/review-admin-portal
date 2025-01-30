import { Loader2Icon } from 'lucide-react'
import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'

export interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
  loadingContent?: React.ReactNode
  icon?: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    { isLoading, children, icon = null, loadingContent = children, ...props },
    ref
  ) => {
    return (
      <Button ref={ref} {...props} disabled={isLoading || props.disabled}>
        {isLoading ? (
          <Loader2Icon className="mr-2 size-4 animate-spin" />
        ) : (
          icon
        )}
        {isLoading ? loadingContent : children}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
