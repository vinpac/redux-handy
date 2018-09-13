import { AnyAction } from 'redux'
import { Reducer, ReducerMap } from './types'
import { matchActionType } from './combine-actions'

export default function createReducer<S>(map: ReducerMap<S>, initialState: S): Reducer<S> {
  if (!map) {
    throw new Error('Map is a required argument')
  }

  if (initialState === undefined) {
    throw new Error('initialState is an required argument')
  }

  return (state: S = initialState, action: AnyAction): S => {
    let newState: S = state
    Object.keys(map).forEach(actionTypes => {
      if (matchActionType(actionTypes, action.type)) {
        newState = map[actionTypes](state, action)
      }
    })

    return newState
  }
}
