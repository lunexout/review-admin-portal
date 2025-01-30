import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type PreventNavigationProps = {
  when: boolean
}

/**
 * Shows a confirmation dialog when user is trying to leave a page. Fires when `when` property is true. Should be used in long forms where the user might accidentally lose unsaved changes.
 *
 * - Works when closing a browser tab.
 * - Works when clicking any <a /> element on the page.
 * - Doesn't work when using a browser back button.
 *
 * Inspired by https://medium.com/@joaojbs199/page-exit-prevention-in-nextjs-14-7f42add43297
 *
 * Check out this link for possible back button handling: https://github.com/vercel/next.js/discussions/42016#discussioncomment-7668405
 */
export const PreventNavigation = ({ when }: PreventNavigationProps) => {
  const t = useTranslations('PreventNavigation')

  const [leavingPage, setLeavingPage] = useState(false)
  const router = useRouter()

  /**
   * Function that will be called when the user selects `yes` in the confirmation modal, redirected to the selected page.
   */
  const confirmationFn = useRef<() => void>(() => {})

  // Used to make popstate event trigger when back button is clicked.
  // Without this, the popstate event will not fire because it needs there to be a href to return.
  // TODO: [16] This doesn't work, see `handlePopState` below
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     window.history.pushState(null, document.title, window.location.href)
  //   }
  // }, [])

  useEffect(() => {
    /**
     * Used to prevent navigation when use click in navigation `<Link />` or `<a />`.
     */
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement
      const closestLink = target.closest('a')

      if (when) {
        event.preventDefault()

        confirmationFn.current = () => {
          if (closestLink) {
            router.push(closestLink.href)
          }
        }

        setLeavingPage(true)
      }
    }

    /**
     * Used to prevent navigation when use `back` browser buttons.
     * TODO: [16] This doesn't work
     */
    // const handlePopState = () => {
    //   if (when) {
    //     window.history.pushState(null, document.title, window.location.href)

    //     confirmationFn.current = () => {
    //       router.push(backHref)
    //     }

    //     setLeavingPage(true)
    //   } else {
    //     window.history.back()
    //   }
    // }

    /**
     * Used to prevent navigation when reload page or navigate to another page, in different origin.
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault()
        e.returnValue = true
      }
    }

    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', handleClick)
    })
    // window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.querySelectorAll('a').forEach((link) => {
        link.removeEventListener('click', handleClick)
      })
      // window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [when, router])

  return (
    <>
      <AlertDialog open={leavingPage}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('subtitle')}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="w-full justify-between flex items-center">
              <Button
                onClick={() => {
                  setLeavingPage(false)
                  confirmationFn.current = () => {}
                }}
                variant="outline"
              >
                {t('cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  confirmationFn.current()
                  confirmationFn.current = () => {}
                }}
              >
                {t('discard_changes')}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
