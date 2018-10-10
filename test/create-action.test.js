import { createAction } from '../src'

describe('Redux actions', () => {
  it('should output type when convertimg to string', () => {
    const increment = createAction('INCREMENT')
    expect(increment.type).toEqual('INCREMENT')
    expect(String(increment)).toEqual('INCREMENT')
  })

  it('should dispatch twice with no errors', () => {
    const increment = createAction('INCREMENT')
    expect(increment(12)).toEqual({
      type: 'INCREMENT',
      payload: 12,
    })
  })

  it('should throw an error only if throw error is equal true', async () => {
    const throwableError = new Error('Some error')
    const actionCreator = createAction('INCREMENET', payload => {
      throw throwableError
    })
    const dispatch = () => null
    try {
      await actionCreator()(dispatch)
    } catch (error) {
      throw new Error('Error thrown when not passing throwError')
    }

    try {
      await actionCreator()(dispatch, null, {})
    } catch (error) {
      throw new Error('Error thrown when passing a throwError not equal true')
    }

    try {
      await actionCreator()(dispatch, null, true)
    } catch (error) {
      expect(error).toEqual(throwableError)
    }
  })

  it('should dispatch only once when passing a function that does not return a promise', () => {
    let dispatchCalled
    const increment = createAction('INCREMENT', payload => payload)
    const dispatch = action => {
      if (dispatchCalled) {
        throw new Error('Dispatch called twice')
      }

      dispatchCalled = true
      expect(action).toEqual({ type: 'INCREMENT', payload: 12 })
    }
    increment(12)(dispatch)
  })

  it('should dispatch twice when the payload resolver returns a promise', async () => {
    let dispatchCount = 0
    const dispatch = action => {
      dispatchCount += 1
      if (dispatchCount === 1) {
        expect(action).toEqual({ type: 'INCREMENT', async: true, pending: true })
      } else {
        expect(action).toEqual({ type: 'INCREMENT', async: true, pending: false, payload: 12 })
      }
    }
    const increment = createAction('INCREMENT', payload => new Promise(resolve => resolve(payload)))
    await increment(12)(dispatch)
    if (dispatchCount !== 2) {
      throw new Error(`Dispatch was called ${dispatchCount} times`)
    }
  })

  it('should dispatch an error when async action fails', async () => {
    let dispatchCount = 0
    const dispatch = action => {
      dispatchCount += 1
      if (dispatchCount === 1) {
        expect(action).toEqual({ type: 'INCREMENT', async: true, pending: true })
      } else {
        expect(action).toEqual({
          type: 'INCREMENT',
          async: true,
          pending: false,
          error: true,
          payload: 12,
        })
      }
    }
    const increment = createAction(
      'INCREMENT',
      payload => new Promise((_, reject) => reject(payload)),
    )
    await increment(12)(dispatch)
    if (dispatchCount !== 2) {
      throw new Error(`Dispatch was called ${dispatchCount} times`)
    }
  })
})