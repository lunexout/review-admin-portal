/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextAuthOptions, Session } from 'next-auth'
import { AuthSession } from '../types/auth'
import { logCallback } from './shared'

export const authCallbackSession: NonNullable<
  NextAuthOptions['callbacks']
>['session'] = async ({
  /**
   * You should validate this data before using it.
   */
  session: rawSession,
  token
}) => {
  logCallback('callback-session')

  // const token: any = (userOrToken as any).token
  const session: Session = rawSession

  logCallback('TOKEN FROM SESSION CB:', { token })

  const newSession: AuthSession = {
    expires: session.expires,
    user: {
      id: token.id,
      email: token.email,
      name: token.name,
      image: token.image,
      status: token.status,
      permissions: token.permissions
    } as never
  }

  return newSession

  // TODO: Implement refresh token functionality here. Do we need it? Not sure.
}
