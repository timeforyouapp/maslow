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
    store.dispatch({ type: types.success, payload });
    return payload;
  }).catch((error) => {
    console.log(error);
    if (!types.error) {
      return error;
    }

    const dispatch = { type: types.error, payload: error };

    if (error.response) {
      dispatch.payload = error.response.data.payload;
    }

    store.dispatch(dispatch);
  });
};

export default apiMiddleware;
