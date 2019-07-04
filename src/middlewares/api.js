export const apiMiddleware = (apiConfig, actionMaker) => store => next => (action) => {
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
    next({ type: types.success, payload });
    return payload;
  }).catch((error) => {
    if (error.response && apiConfig) {
      const handlr = apiConfig.statusHandler[error.response.status] || apiConfig.statusHandler.default;

      if (handlr) {
        const dispatchObj = handlr({ type: types.error }, error, {
          store, api: apiConfig, action, actionCaller: actionMaker(store),
        });

        return dispatchObj ? next(dispatchObj) : null;
      }
    }

    console.error(error);
  });

};

export default apiMiddleware;
