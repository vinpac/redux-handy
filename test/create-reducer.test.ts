import { AnyAction } from 'redux'
import { createAction, createReducer, combineActions } from '../src'

describe('Redux Actions', () => {
  describe('Create action handler', () => {
    it('should handle some actions and return the correct state', () => {
      let currentState = 1
      const increment = createAction<number>('INCREMENT')
      const decrement = createAction<number>('DECREMENT')
      const actionHandler = createReducer<number>(
        {
          [String(increment)]: (state, action) => state + action.payload,
          [String(decrement)]: (state, action) => state - action.payload,
        },
        currentState,
      )
      const dispatch = (action: AnyAction) => {
        currentState = actionHandler(currentState, action)
      }

      dispatch(increment(5))
      expect(currentState).toEqual(6)

      dispatch(decrement(2))
      expect(currentState).toEqual(4)
    })

    it('should handle async actions', async () => {
      let currentState = { count: 0 }
      const fetch = createAction('FETCH', slug => new Promise(resolve => resolve(slug)))
      const increment = createAction('INCREMENT', undefined, { number: 1 })
      const decrement = createAction('DECREMENT', undefined, { number: -1 })
      const actionHandler = createReducer(
        {
          [String(fetch)]: (state, action) => {
            return {
              ...state,
              fetching: action.pending || false,
              fetched: !!action.payload,
              count: !action.error && action.payload ? action.payload : state.count,
            }
          },
          [combineActions(String(increment), String(decrement))]: (state, action) => ({
            ...state,
            count: state.count + action.payload * action.meta.number,
          }),
        },
        currentState,
      )
      const dispatch = action => {
        currentState = actionHandler(currentState, action)
      }

      const promise = fetch(5)(dispatch, () => null)
      expect(currentState).toEqual({ count: 0, fetched: false, fetching: true })
      await promise
      expect(currentState).toEqual({ fetched: true, fetching: false, count: 5 })

      dispatch(increment(10))
      dispatch(decrement(2))
      expect(currentState).toEqual({ fetched: true, fetching: false, count: 13 })
    })
  })
})
