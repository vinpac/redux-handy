/* eslint-env jest */
import { AnyAction } from 'redux'
import { createAction } from '../src'

describe('Redux actions', () => {
  it('should output type when convertimg to string', () => {
    const increment = createAction<string>('INCREMENT')
    expect(increment.type).toEqual('INCREMENT')
    expect(String(increment)).toEqual('INCREMENT')
  })

  it('should dispatch twice with no errors', () => {
    const increment = createAction('INCREMENT')
    expect(increment(12)).toEqual({
      error: false,
      type: 'INCREMENT',
      payload: 12,
    })
  })

  it('should throw an error only if intended', async () => {
    const throwableError = new Error('Some error')
    const getState = () => ({})
    const actionCreator = createAction<any>('INCREMENET', () => {
      throw throwableError
    })
    const dispatch = (p: any) => p
    try {
      await actionCreator(undefined)(dispatch, getState)
    } catch (error) {
      throw new Error('Error thrown when not passing throwError')
    }

    try {
      const { error, payload } = await actionCreator(undefined)(dispatch, getState)

      if (error) {
        throw payload
      }
    } catch (error) {
      expect(error).toEqual(throwableError)
    }
  })

  it('should dispatch only once when passing a function that does not return a promise', () => {
    let dispatchCalled: boolean
    const increment = createAction<number>('INCREMENT', payload => payload)
    const getState = () => ({})
    const dispatch = (action: AnyAction) => {
      if (dispatchCalled) {
        console.log(action)
        throw new Error('Dispatch called twice')
      }

      dispatchCalled = true
      expect(action).toEqual({ type: 'INCREMENT', error: false, payload: 12 })
    }
    increment(12)(dispatch, getState)
  })

  it('should dispatch twice when the payload resolver returns a promise', async () => {
    let dispatchCount = 0
    const getState = () => ({})
    const dispatch = (action: AnyAction) => {
      dispatchCount += 1
      if (dispatchCount === 1) {
        expect(action).toEqual({ type: 'INCREMENT', async: true, pending: true })
      } else {
        expect(action).toEqual({
          type: 'INCREMENT',
          error: false,
          async: true,
          pending: false,
          payload: 12,
        })
      }
    }
    const increment = createAction<number>(
      'INCREMENT',
      payload => new Promise(resolve => resolve(payload)),
    )
    await increment(12)(dispatch, getState)

    if (dispatchCount !== 2) {
      throw new Error(`Dispatch was called ${dispatchCount} times`)
    }
  })

  it('should dispatch an error when async action fails', async () => {
    let dispatchCount = 0
    const getState = () => ({})
    const dispatch = (action: AnyAction) => {
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
    const incrementAsync = createAction(
      'INCREMENT',
      payload => new Promise((_, reject) => reject(payload)),
    )
    await incrementAsync(12)(dispatch, getState)
    if (dispatchCount !== 2) {
      throw new Error(`Dispatch was called ${dispatchCount} times`)
    }
  })

  it('should dispatch an meta when given', async () => {
    let dispatchCount = 0
    const getState = () => ({})
    const dispatch = (action: AnyAction) => {
      dispatchCount += 1
      expect(action).toEqual({ type: 'CHANGE', error: false, payload: -10, meta: 'ODD' })
    }
    const change = createAction<number, number, 'ODD' | 'POSITIVE'>(
      'CHANGE',
      payload => payload,
      payload => (payload < 0 ? 'ODD' : 'POSITIVE'),
    )
    await change(-10)(dispatch, getState)
    if (dispatchCount !== 1) {
      throw new Error(`Dispatch was called ${dispatchCount} times`)
    }
  })

  it('should dispatch an meta when given in an async action', async () => {
    let dispatchCount = 0
    const getState = () => ({})
    const dispatch = (action: AnyAction) => {
      dispatchCount += 1
      if (dispatchCount === 1) {
        expect(action).toEqual({
          type: 'CHANGE',
          pending: true,
          async: true,
          meta: 'ODD',
        })
      } else {
        expect(action).toEqual({
          type: 'CHANGE',
          pending: false,
          async: true,
          error: false,
          payload: -10,
          meta: 'ODD',
        })
      }
    }
    const change = createAction<number, number, 'ODD' | 'POSITIVE'>(
      'CHANGE',
      payload => new Promise(resolve => resolve(payload)),
      payload => (payload < 0 ? 'ODD' : 'POSITIVE'),
    )
    await change(-10)(dispatch, getState)
    if (dispatchCount !== 2) {
      throw new Error(`Dispatch was called ${dispatchCount} times`)
    }
  })
})
