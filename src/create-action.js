import { ACTION_TYPE_SEPARATOR } from './combine-actions'

export default function createAction(type, payloadResolver, defaultMeta) {
  if (type.includes(ACTION_TYPE_SEPARATOR)) {
    throw new Error('The type includes an an unallowed character \'||\'')
  }

  let actionCreator
  if (!payloadResolver) {
    actionCreator = payload => {
      const action = { type, payload }
      if (action instanceof Error) {
        action.error = true
      }
      if (defaultMeta) {
        action.meta = defaultMeta
      }
      return action
    }
  } else {
    actionCreator = unresolvedPayload => async (dispatch, getState) => {
      let meta = defaultMeta
      let prevented
      let isPromise

      try {
        const payload = payloadResolver(unresolvedPayload, {
          getState,
          dispatch,
          setMeta: newMeta => {
            meta = newMeta
          },
          prevent: () => {
            prevented = true
          },
        })

        if (prevented) {
          return
        }

        isPromise = payload instanceof Promise

        if (isPromise) {
          dispatch({ type, async: true, pending: true, meta })
          await payload.then(resolvedPayload =>
            dispatch({ type, async: true, pending: false, payload: resolvedPayload, meta }),
          )
        } else {
          dispatch({ type, payload, meta })
        }
      } catch (error) {
        const action = { type, payload: error, error: true, meta }
        if (isPromise) {
          action.async = true
          action.pending = false
        }
        dispatch(action)
      }
    }
  }

  actionCreator.type = type
  actionCreator.toString = () => type

  return actionCreator
}
