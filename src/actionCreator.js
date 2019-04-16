export const ActionCreator = (name, types, api, customActions = {}) => ({
  [`_set${name}`]: item => ({
    type: types.set,
    payload: item,
  }),
  [`_setAll${name}`]: items => ({
    type: types.setAll,
    payload: items,
  }),
  [`_clearState${name}`]: () => ({
    type: types.clearState,
  }),
  [`setErrors${name}`]: data => ({
    type: types.setErrors,
    payload: data,
  }),
  [`clearFieldError${name}`]: payload => ({
    payload,
    type: types.clearFieldError,
  }),
  [`clearAllErrors${name}`]: () => ({
    type: types.clearAllErrors,
  }),
  [`clearFetchState${name}`]: () => ({
    type: types.clearFetchState,
  }),
  [`getDetail${name}`]: payload => ({
    payload,
    type: types.getDetail,
    api: id => api.getDetail(id),
  }),
  [`getList${name}`]: payload => ({
    payload,
    type: types.getList,
    api: queryParams => api.getList(queryParams),
  }),
  [`save${name}`]: payload => ({
    payload,
    type: types.save,
    api: ({ id, ...data }) => (id ? api.update(id, data) : api.create(data)),
  }),
  [`remove${name}`]: payload => ({
    payload,
    type: types.remove,
    api: id => api.remove(id),
  }),
  ...customActions,
});

export default ActionCreator;
