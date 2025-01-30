import { dequal } from 'dequal'
import React from 'react'

export function useDeepCompareMemoize(dependencies: React.DependencyList) {
  const dependenciesRef = React.useRef<React.DependencyList>(dependencies)
  const signalRef = React.useRef<number>(0)

  if (!dequal(dependencies, dependenciesRef.current)) {
    dependenciesRef.current = dependencies
    signalRef.current += 1
  }

  return React.useMemo(() => dependenciesRef.current, [signalRef.current])
}
