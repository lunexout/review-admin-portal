import { type ReactNode } from 'react'

export const FormSectionHeader = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-lg font-semibold leading-none">{children}</h2>
}
