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
    [types.domainFetchSuccess]: (state) => ({
      ...state,
      fetching: false,
    }),
    [types.domainFetchError]: (state, payload) => ({
      ...state,
      fetching: false,
      errors: payload,
    })
  }
  
  _reducerMap[types.getDetail.success] = _reducerMap[types.setType]
  _reducerMap[types.getList.success] = _reducerMap[types.setAllType]
  _reducerMap[types.save.success] = _reducerMap[types.setType]
  _reducerMap[types.delete.success] = _reducerMap[types.clearState]
  
  const reducerMap = {
    ..._reducerMap,
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