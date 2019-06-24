import clone from 'fast-clone';

const baseInitialState = {
  fetchState: 'fresh',
  errors: {},
  detail: {},
  list: [],
};

const includeOnListOrUpdate = (idLabel, list, payload) => {
  let changeOnList = false;

  const newList = list.map((item) => {
    if (item[idLabel] === payload[idLabel]) {
      changeOnList = true;
      return { ...item, ...payload };
    }

    return item;
  });

  if (!changeOnList) {
    newList.push(payload);
  }

  return newList;
};


export const ReducerCreator = (types, customInitialState = {}, customReducers = {}, customIdLabel = 'id', customSetError) => {
  const initialState = clone({
    ...baseInitialState,
    ...customInitialState,
  });

  const baseReducerMap = {
    [types.set]: (state, payload) => ({
      ...state,
      detail: payload,
      list: state.list.map((item) => {
        if (item.id === payload.__proto__.prev_payload) {
          return payload;
        }

        return item;
      }),
    }),
    [types.setAll]: (state, payload) => ({
      ...state,
      list: payload,
    }),
    [types.setFetchState]: (state, payload) => ({
      ...state,
      fetchState: payload,
    }),
    [types.clearState]: () => clone(initialState),
    [types.clearFieldError]: (state, payload) => {
      const newState = { ...state };

      newState.fetchState = 'dirty';
      delete newState.errors[payload];
      return newState;
    },
    [types.deleteItem]: (state, payload) => ({
      ...state,
      fetchState: 'dirty',
      detail: {},
      list: state.list.filter(({ id }) => {
        return id !== payload.__proto__.prev_payload;
      }),
    }),
    [types.clearAllErrors]: state => ({
      ...state,
      fetchState: 'dirty',
      errors: {},
    }),
    [types.clearFetchState]: state => ({
      ...state,
      fetchState: 'dirty',
    }),
    [types.domainFetching]: state => ({
      ...state,
      fetchState: 'fetching',
    }),
    [types.domainFetchError]: (state, payload) => {
      console.log(customSetError);
      return ({
      ...state,
      fetchState: 'failed',
      errors: customSetError ? customSetError(payload) : payload,
    })},
    [types.setErrors]: (state, payload) => {
      console.log(customSetError);
      return ({
      ...state,
      errors: customSetError ? customSetError(payload) : payload,
    })},
  };

  const setFetchTrue = (reducerFn, fetchState, changeOnList) => (state, payload) => {
    const newState = { ...reducerFn(state, payload) };

    newState.fetchState = fetchState;

    if (changeOnList) {
      newState.list = includeOnListOrUpdate(customIdLabel, newState.list, payload);
    }

    return newState;
  };

  const reducerMap = {
    ...baseReducerMap,
    [types.getDetail.success]: setFetchTrue(baseReducerMap[types.set], 'detailFetched'),
    [types.getList.success]: setFetchTrue(baseReducerMap[types.setAll], 'listFetched'),
    [types.save.success]: setFetchTrue(baseReducerMap[types.set], 'saveFetched', true),
    [types.remove.success]: setFetchTrue(baseReducerMap[types.deleteItem], 'removeFetched'),
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
