import type { Dispatch, ReactElement, SetStateAction } from 'react'

type PrivateTag = {
  readonly _id: unique symbol
}

/**
 * @description
 * Used to define callback props. The callback can accept either arguments or a single object.
 *
 * @example
 * type Props = {
 *   initialName: string
 *   onChange: Handler<{
 *     name: string
 *   }>
 * }
 *
 * const WidgetUser = ({ initialName, onChange }: Props) => {
 *   const [name, setName] = useState(initialName)
 *
 *   return (
 *     <Fragment>
 *       <Input value={name} onChange={setName} />
 *       <Button onClick={() => { onChange({ name }) }} />
 *     </Fragment>
 *   )
 * }
 */
export type Handler<T extends object = PrivateTag> = PrivateTag extends T
  ? () => void
  : (params: T) => void

export type StateUpdateHandler<T> = Dispatch<SetStateAction<T>>

/**
 * @description
 * The `RenderProp` type is used to define render props - functions passed to the component as a prop that render a `ReactNode` when called by that component.
 *
 * @example
 * type Props = {
 *   userId: string | null
 *   render: RenderProp<{
 *     user: User
 *   }>
 * }
 *
 * const WithUser = ({ userId, render }: Props) => {
 *   const $user = useQuery(getUser({ userId }))
 *   return Query.render($user.state, render)
 * }
 */
export type RenderProp<T extends object = PrivateTag> = PrivateTag extends T
  ? () => ReactElement | null
  : (params: T) => ReactElement | null

export type NextPageSearchParamValue = string | string[] | undefined

/**
 * An object containing the search parameters of the current URL.
 *
 * Use this type only in `page.tsx` and `layout.tsx` components.
 *
 * Always validate search params with `zod` in server components and `nuqs` in client components. The user can put anything to the URL.
 *
 * https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
 */
export type NextPageSearchParams = Prettify<{
  [key: string]: NextPageSearchParamValue
}>

/**
 * The Prettify helper is a utility type that takes an object type and makes the hover overlay more readable.
 *
 * Copied from https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export function absurd<A>(_: never): A {
  throw new Error('absurd')
}
