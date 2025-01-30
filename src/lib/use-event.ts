import { useCallback, useInsertionEffect, useRef } from 'react'

// https://stackoverflow.com/questions/76335194/is-this-an-accurate-polyfill-of-reacts-useeffectevent
export function useEvent<T extends (...params: any[]) => any>(fn: T): T {
  const ref = useRef<T>(fn)
  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])
  return useCallback((...args: any) => {
    const f = ref.current
    return f(...args)
  }, []) as any
}
