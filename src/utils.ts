export function isPromiseLike<T>(value: any): value is PromiseLike<T> {
  return value != null && typeof (value as PromiseLike<T>).then === 'function'
}
