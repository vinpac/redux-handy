export default function handleAction(action, payloadResolver, errorResolver = 'error') {
  if (typeof action !== 'object') {
    throw new Error(`Expected action to be an object received ${typeof action}`)
  }

  let newState = {}

  if (action.async) {
    newState.fetching = !!action.pending
    newState.fetched = !action.pending
  }

  if (typeof errorResolver === 'function') {
    newState = { ...newState, ...errorResolver(action.error ? action.payload : null) }
  } else {
    newState[errorResolver] = action.error ? action.payload : null
  }

  if (action.error || (action.async && action.pending)) {
    return newState
  }

  if (payloadResolver === true || typeof payloadResolver === 'function') {
    const resolvedState = payloadResolver === true
      ? action.payload
      : payloadResolver(action.payload, action.meta)

    return { ...newState, ...resolvedState }
  }

  if (payloadResolver) {
    newState[payloadResolver] = action.payload
  }

  return newState
}
