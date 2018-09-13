import { createAction } from '../src'
import combineActions, { ACTION_TYPE_SEPARATOR } from '../src/combine-actions'

describe('Redux actions', () => {
  describe('Combine actions', () => {
    it('should combine an action with an string', () => {
      const increment = createAction<string>('INCREMENT')
      expect(combineActions(String(increment), 'DECREMENT')).toEqual(
        `${increment.type}${ACTION_TYPE_SEPARATOR}DECREMENT`,
      )
    })
  })
})
