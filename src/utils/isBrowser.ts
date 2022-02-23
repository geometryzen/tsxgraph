/**
  * A document/window environment is available.
  * @type Boolean
  * @default false
  */
export const isBrowser = typeof window === 'object' && typeof document === 'object';