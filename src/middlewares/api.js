export const apiMiddleware = store => next => (action) => {
  if (!action.api) {
    return Promise.resolve(next(action));
  }

  let types = {};

  if (typeof action.type === 'string') {
    types.success = action.type;
  } else {
    types = action.type || action.types;
  }

  if (types.fetching) {
    store.dispatch({ type: types.fetching, payload: action.payload });
  }

  return action.api(action.payload).then((payload) => {
    payload.__proto__.prev_payload = action.payload;
    store.dispatch({ type: types.success, payload });
    return payload;
  }).catch((error) => {
    const dispatch = { type: types.error, payload: error };

    if (error.response) {
      dispatch.payload = error.response.data.payload || error.response.data;
    }

    store.dispatch(dispatch);
  });
};

export default apiMiddleware;
