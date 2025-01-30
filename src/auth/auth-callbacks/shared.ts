import { log } from '../logger'

export const logCallback = (callbackName: string, input?: unknown) => {
  if (input) {
    log(`[Callback: ${callbackName}]`, JSON.stringify(input, null, 2))
  } else {
    log(`[Callback: ${callbackName}]`)
  }
}
