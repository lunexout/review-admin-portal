'use client'

import * as React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// Why is it needed:
// - https://mui.com/base-ui/react-no-ssr/
// - https://github.com/mui/material-ui/issues/26763
//
// Consider replacing with one of these:
// - https://gist.github.com/omrimor/d8c041a26c04327304aeae2891528b33
// - https://www.npmjs.com/package/react-no-ssr
// - https://www.npmjs.com/package/@kwooshung/react-no-ssr
const NoSSR = ({ children, fallback = <span /> }: Props) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return fallback
  }

  return children
}

export default NoSSR
