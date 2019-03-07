import clone from 'fast-clone';

const baseInitialState = {
  fetching: false,
  errors: [],
  detail: {},
  list: [],
};

export const ReducerCreator = (types, customInitialState = {}, customReducers = {}) => {
  const initialState = clone({
    ...baseInitialState,
    ...customInitialState,
  });

  const _reducerMap = {
    [types.set]: (state, payload) => ({
      ...state,
      detail: payload
    }),
    [types.setAll]: (state, payload) => ({
      ...state,
      list: payload,
    }),
    [types.clearState]: () => {
      return clone(initialState);
    },
    [types.domainFetching]: (state) => ({
      ...state,
      fetching: true,
    }),
    [types.domainFetchError]: (state, payload) => ({
      ...state,
      fetching: false,
      errors: payload,
    })
  }
  
  const reducerMap = {
    ..._reducerMap,
    [types.getDetail.success]: _reducerMap[types.set],
    [types.getList.success]: _reducerMap[types.setAll],
    [types.save.success]: _reducerMap[types.set],
    [types.remove.success]: _reducerMap[types.clearState],
    ...customReducers,
  }

  return (state = clone(initialState), action) => {
    const reducer = reducerMap[action.type];

    if (reducer) {
      return reducer(state, action.payload)
    }
    
    return state;
  }
}

export default ReducerCreator;