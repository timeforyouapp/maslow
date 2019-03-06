export const apiMiddleware = store => next => action => {
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

    return action.api(action.payload).then(payload => {
      store.dispatch({ type: types.success, payload });
      return payload;
    }).catch(error => {
        if (types.error) {
          store.dispatch({ type: types.error, payload: error });
        }

        return error;
    });
}

export default apiMiddleware;