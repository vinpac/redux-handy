import { matchActionType } from './combine-actions'

export default function createActionHandler(map, initialState) {
  if (!map) {
    throw new Error('Map is a required argument')
  }

  if (initialState === undefined) {
    throw new Error('initialState is an required argument')
  }

  return (state = initialState, action) => {
    let newState = state
    Object.keys(map).forEach(actionTypes => {
      if (matchActionType(actionTypes, action.type)) {
        newState = map[actionTypes](state, action)
      }
    })

    return newState
  }
}
