import {
  Thunk,
  Dispatch,
  PromiseAction,
  PayloadAction,
  PayloadCreator,
  ActionCreator,
  ThunkActionCreator,
  MetaCreator,
} from './types'
import { isPromiseLike } from './utils'

export default function createAction<P>(type: string): ActionCreator<P | undefined>
export default function createAction<A, P = A, M = undefined>(
  type: string,
  payloadCreator?: PayloadCreator<A, P, M>,
  metaCreator?: MetaCreator<A, M> | M,
): ThunkActionCreator<A, P, M>
export default function createAction<A, P = A, M = undefined>(
  type: string,
  payloadCreator?: PayloadCreator<A, P, M>,
  metaCreator?: MetaCreator<A, M> | M,
): ActionCreator<P | undefined> | ThunkActionCreator<A, P, M> {
  const metaCreatorFn: MetaCreator<A, M> | undefined =
    typeof metaCreator === 'function' ? (metaCreator as MetaCreator<A, M>) : undefined

  if (payloadCreator === undefined) {
    const actionCreator: ActionCreator<P | undefined> = (
      payload: P | undefined | Error,
    ): PayloadAction<P | undefined> => {
      return {
        type,
        meta:
          metaCreator !== undefined
            ? metaCreatorFn ? metaCreatorFn((payload as any) as A) : (metaCreator as M)
            : undefined,
        payload,
        error: payload instanceof Error,
      }
    }

    actionCreator.type = type
    actionCreator.toString = () => type

    return actionCreator
  }

  const actionCreator: ThunkActionCreator<A, P, M> = (
    payload: A,
  ): Thunk<Promise<PayloadAction<P, M>>> => async (dispatch: Dispatch, getState: Function) => {
    let meta: M | undefined = undefined
    try {
      let prevented: boolean = false
      if (metaCreator) {
        meta = metaCreatorFn ? metaCreatorFn(payload) : (metaCreator as M)
      }

      const createdPayload = payloadCreator(payload, {
        dispatch,
        getState,
        meta,
        prevent() {
          prevented = true
        },
      })

      if (prevented) {
        return {
          type,
          payload: createdPayload,
          prevented: true,
        }
      }

      if (isPromiseLike(createdPayload)) {
        dispatch({
          type,
          meta,
          async: true,
          pending: true,
        } as PromiseAction<P, M>)

        const resolvedPayload = await createdPayload
        return dispatch({
          type,
          meta,
          payload: resolvedPayload,
          async: true,
          pending: false,
          error: false,
        } as PromiseAction<P, M>)
      }

      return dispatch({
        type,
        meta,
        payload: createdPayload,
        error: createdPayload instanceof Error,
      } as PayloadAction<P, M>)
    } catch (error) {
      return dispatch({
        type,
        meta,
        payload: error,
        async: true,
        pending: false,
        error: true,
      } as PromiseAction<P>)
    }
  }

  actionCreator.type = type
  actionCreator.toString = () => type

  return actionCreator
}
