import clone from 'fast-clone';

const baseInitialState = {
  fetchState: 'fresh',
  errors: [],
  detail: {},
  list: [],
};

export const ReducerCreator = (types, customInitialState = {}, customReducers = {}) => {
  const initialState = clone({
    ...baseInitialState,
    ...customInitialState,
  });

  const baseReducerMap = {
    [types.set]: (state, payload) => ({
      ...state,
      detail: payload,
    }),
    [types.setAll]: (state, payload) => ({
      ...state,
      list: payload,
    }),
    [types.clearState]: () => clone(initialState),
    [types.clearFieldError]: (state, payload) => {
      const newState = { ...state };

      newState.fetchState = 'dirty';
      delete newState.errors[payload];
      return newState;
    },
    [types.clearAllErrors]: state => ({
      ...state,
      fetchState: 'dirty',
      errors: {},
    }),
    [types.domainFetchState]: state => ({
      ...state,
      fetchState: 'fetching',
    }),
    [types.domainFetchError]: (state, payload) => ({
      ...state,
      fetchState: 'failed',
      errors: payload,
    }),
  };

  const setFetchTrue = (reducerFn, fetchState) => (state, payload) => {
    const newState = { ...reducerFn(state, payload) };
    newState.fetchState = fetchState;

    return newState;
  };

  const reducerMap = {
    ...baseReducerMap,
    [types.getDetail.success]: setFetchTrue(baseReducerMap[types.set], 'detailFetched'),
    [types.getList.success]: setFetchTrue(baseReducerMap[types.setAll], 'listFetched'),
    [types.save.success]: setFetchTrue(baseReducerMap[types.set], 'saveFetched'),
    [types.remove.success]: setFetchTrue(baseReducerMap[types.clearState], 'removeFetched'),
    ...customReducers,
  };

  return (state = clone(initialState), action) => {
    const reducer = reducerMap[action.type];

    if (reducer) {
      return reducer(state, action.payload);
    }

    return state;
  };
};

export default ReducerCreator;
