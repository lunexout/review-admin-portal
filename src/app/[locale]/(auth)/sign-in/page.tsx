import { type Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { AuthForm } from './_components/auth-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SignInPage')

  return {
    title: t('page_title')
  }
}

export default function SigninPage() {
  return (
    <>
      <AuthForm />
    </>
  )
}
