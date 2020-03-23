type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends object
  ? RecursivePartial<T[P]>
  : T[P]
}
type ArgumentsOf<T> = T extends (...args: infer A) => any ? A : never
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
