import { handleAction } from '../src'

describe('Redux actions', () => {
  it('should handle multiple stateResolvers', () => {
    expect(
      handleAction(
        {
          type: 'FETCH_RESULTS',
          payload: { results: 12 },
        },
        true,
      ),
    ).toEqual({ error: null, results: 12 })
    expect(
      handleAction(
        {
          type: 'FETCH_RESULTS',
          payload: { results: 12 },
        },
        'score',
      ),
    ).toEqual({ error: null, score: { results: 12 } })

    expect(
      handleAction(
        {
          type: 'FETCH_RESULTS',
          payload: { results: 12 },
        },
        score => ({ someResult: score.results }),
      ),
    ).toEqual({ error: null, someResult: 12 })
  })

  it('should handle async actions', () => {
    expect(
      handleAction(
        {
          type: 'INCREMENT',
          payload: 12,
          async: true,
          pending: true,
        },
        'count',
      ),
    ).toEqual({ error: null, fetching: true, fetched: false })
    expect(
      handleAction(
        {
          type: 'INCREMENT',
          payload: 12,
          async: true,
          pending: false,
        },
        'count',
      ),
    ).toEqual({ error: null, fetching: false, fetched: true, count: 12 })
  })

  it('should handle error resolver', () => {
    const error = new Error('Could not increment')
    expect(
      handleAction(
        {
          type: 'INCREMENT',
          payload: error,
          error: true,
          async: true,
          pending: true,
        },
        'count',
      ),
    ).toEqual({ error, fetching: true, fetched: false })
    expect(
      handleAction(
        {
          type: 'INCREMENT',
          payload: error,
          error: true,
          async: true,
          pending: false,
        },
        'count',
        'failedError',
      ),
    ).toEqual({ failedError: error, fetching: false, fetched: true })
    expect(
      handleAction(
        {
          type: 'INCREMENT',
          payload: error,
          error: true,
          async: true,
          pending: false,
        },
        'count',
        err => ({ someError: error }),
      ),
    ).toEqual({ someError: error, fetching: false, fetched: true })
  })
})
