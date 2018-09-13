import { AnyAction } from 'redux'

export interface PayloadAction<P, M = any> extends AnyAction {
  payload: P | Error
  meta?: M
  error: boolean
}

export interface PromiseAction<P, M = any> extends PayloadAction<P, M> {
  async: true
  pending: boolean
}

export type Dispatch = (action: AnyAction | Thunk) => any

export type Thunk<T = any> = (dispatch: Dispatch, getState: Function) => T

export interface ActionCreator<P> {
  (payload: P | Error): PayloadAction<P>
  type?: string
}

export interface ThunkActionCreator<A, P = A, M = any> {
  (payload: A): Thunk<Promise<PayloadAction<P, M>>>
  type?: string
}

export type PayloadCreatorContext<M> = {
  dispatch: Dispatch
  getState: Function
  meta?: M
  prevent: () => void
}

export interface MetaCreator<A, M> {
  (payload: A): M
}

export interface PayloadCreator<C, P, M = undefined> {
  (payload: C, context: PayloadCreatorContext<M>): P | Promise<P> | void
}

export interface Reducer<S> {
  (state: S, action: AnyAction): S
}

export type ReducerMap<S> = {
  [actionType: string]: Reducer<S>
}
