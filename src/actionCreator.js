export const ActionCreator = (name, types, api, customActions = {}) => ({
    [`_set${name}`]: (item) => ({
        type: types.set,
        payload: item,
    }),
    [`_setAll${name}`]: (items) => ({
        type: types.setAll,
        payload: items,
    }),
    [`_clear${name}State`]: () => ({
        type: types.clearState
    }),
    [`get${name}Detail`]: (id) => ({
        type: types.getDetail,
        api: api.getDetail(id),
    }),
    [`get${name}List`]: (queryParams) => ({
        type: types.getList,
        api: api.getList(queryParams),
    }),
    [`save${name}`]: (id, item) => ({
        type: item ? types.update :  types.create,
        api: item ? api.update(id, item) : api.create(id),
    }),
    [`delete${name}`]: (id) => ({
        type: types.delete,
        api: api.delete(id),
    }),
    ...customActions
});

export default ActionCreator;