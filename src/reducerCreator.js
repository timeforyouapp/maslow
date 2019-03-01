export const ReducerCreator = (name, types, initialState = {}, customReducers = {}) => {
    const _reducerMap = {
      [types.setType]: (state, payload) => ({
        ...state,
        detail: action.payload
      }),
      [types.setAll]: (state, payload) => ({
        ...state,
        list: action.payload,
      }),
      [types.clearState]: (state, payload) => {
        return Object.clone(initialState);
      },
      [types.domainFetching]: (state) => ({
        fetching: true,
      }),
      [types.domainFetchSuccess]: (state, payload) => ({
        fetching: false,
      }),
      [types.domainFetchError]: (state, payload) => ({
        fetching: false,
        errors: payload,
      })
    }
    
    _reducerMap[types.getDetailActions.success] = _reducerMap[types.setType]
    _reducerMap[types.getListActions.success] = _reducerMap[types.setAllType]
    _reducerMap[types.saveActions.success] = _reducerMap[types.setType]
    _reducerMap[types.deleteActions.success] = _reducerMap[types.clearState]
    
    const reducerMap = {
      ..._reducerMap,
      ...customReducers,
    }
  
    return (state = initialState, action) => {
      const reducer = reducerMap[action.type];
      
      if (reducer) {
        return reducer(state, action.payload)
      }
      
      return state;
    }
  }
  