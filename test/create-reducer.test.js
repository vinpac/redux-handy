import { createAction, createReducer, handleAction, combineActions } from '../src'

describe('Redux Actions', () => {
  describe('Create action handler', () => {
    it('should handle some actions and return the correct state', () => {
      let currentState = 1
      const increment = createAction('INCREMENT')
      const decrement = createAction('DECREMENT')
      const actionHandler = createReducer(
        {
          [increment]: (state, action) => state + action.payload,
          [decrement]: (state, action) => state - action.payload,
        },
        currentState,
      )
      const dispatch = action => {
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
          [fetch]: (state, action) => ({
            ...state,
            ...handleAction(action, 'count'),
          }),
          [combineActions(increment, decrement)]: (state, action) => ({
            ...state,
            count: state.count + (action.payload * action.meta.number),
          }),
        },
        currentState,
      )
      const dispatch = action => {
        currentState = actionHandler(currentState, action)
      }

      const promise = fetch(5)(dispatch)
      expect(currentState).toEqual({ error: null, count: 0, fetched: false, fetching: true })
      await promise
      expect(currentState).toEqual({ error: null, fetched: true, fetching: false, count: 5 })

      dispatch(increment(10))
      dispatch(decrement(2))
      expect(currentState).toEqual({ error: null, fetched: true, fetching: false, count: 13 })
    })
  })
})
