export class RemotePromise <T = any> {
  private _promise: Promise<T>
  private _status: PromiseStatus = 'pending'
  private _resolve!: ResolveFn<T>
  private _reject!: RejectFn

  public readonly then: ThenFn<T>
  public readonly catch: CatchFn

  public readonly [Symbol.toStringTag]: string = '[object Promise]'

  /** Instantiates a new remote promise. */
  constructor () {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })

    this.then = this._promise.then.bind(this._promise)
    this.catch = this._promise.catch.bind(this._promise)
  }

  /** Gets the native promise instance. */
  get promise (): Promise<T> {
    return this._promise
  }

  /** Gets the current status of the promise. */
  get status (): PromiseStatus {
    return this._status
  }

  /** Throws an error if the promises has already been resolved. */
  private assertPending () {
    if (this._status !== 'pending') {
      throw new Error(`This promise has already been ${this._status}.`)
    }
  }

  /** Remotely resolve this promise. */
  public resolve (): T extends undefined ? void : never
  public resolve (value: T): T extends undefined ? never : void
  public resolve (value?: T): void {
    this.assertPending()
    this._status = 'fulfilled'
    this._resolve(value as T)
  }

  /** Remotely reject this promise */
  public reject (reason?: any): void {
    this.assertPending()
    this._status = 'rejected'
    this._reject(reason)
  }
}

type PromiseStatus = 'pending' | 'fulfilled' | 'rejected'

type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any

type ThenFn <T> = Promise<T>['then']
type CatchFn = Promise<never>['catch']

type ResolveFn <T> = NonNullable<FirstArgument<ThenFn<T>>>
type RejectFn = NonNullable<FirstArgument<CatchFn>>

export default RemotePromise
