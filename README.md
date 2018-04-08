# Redux Handy
Handy utilities for redux

# Getting Started

## Installation

```bash
$ npm install --save redux-handy
```

or

```
$ yarn add redux-handy
```

## Usage

```js
import { createAction, createReducer, handleAction, combineActions } from 'redux-handy'

const defaultState = { counter: 10 };

const increment = createAction('INCREMENT')
const decrement = createAction('DECREMENT', amount => -amount)

const countReducer = createReducer({
  [combineActions(increment, decrement)] (state, ({ payload: amount })) {
    return { ...state, counter: state.counter + amount };
  }
}, defaultState);


const fetchPost = createAction('FETCH_POST', (slug, { prevent, getState, setMeta }) => {
  const { post: { fetchedSlug } } = getState()

  if (fetchedSlug === slug) {
    // The post is already fetched
    // Prevent any dispatching
    return prevent()
  }

  // Set slug in meta so the reducer can know what slug is being fetched
  setMeta({ slug })

  return fetch(`/api/post/${slug}/`)
})

const postReducer = createReducer({
  [fetchPost]: (state, action) => ({
    ...state,
    ...handleAction(action, 'post'),
    fetchedSlug: action.meta.slug,
  }),
})

/*
Using: dispatch(fetchPost('post-1')) with dispatch 2 actions
1. {
  type: 'FETCH_POST',
  async: true,
  pending: true,
  payload: undefined,
  error: false
  meta: { slug: 'post-1' }
}
2. {
  type: 'FETCH_POST',
  async: true,
  pending: false,
  meta: { slug: 'post-1' },
  payload: {<resolved-promise-return>},
  error: false
}
*/


export default reducer;
```
