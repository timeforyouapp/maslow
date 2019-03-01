export const x = (a,b) => a + b;
export default x;
// export const ActionCreator = (name, types, api = {}, customActions = {}) => ({
//     [`_set${name}`]: (item) => ({
//         type: types.set,
//         payload: item,
//     }),
//     [`_setAll${name}`]: (items) => ({
//         type: types.setAll,
//         payload: items,
//     }),
//     [`_clear${name}State`]: () => ({
//         type: types.clearState
//     }),
//     [`get${name}Detail`]: (apiParams) => ({
//         type: types.getDetail,
//         api: api.getDetail(apiParams),
//     }),
//     [`get${name}List`]: (apiParams) => ({
//         type: types.getListApiActions,
//         api: api.getList(apiParams),
//     }),
//     [`save${name}`]: (id, item) => ({
//         type: typeof id !== 'object' ? types.updateApiActions :  types.createApiActions,
//         api: typeof id !== 'object' ? api.update(id, apiParams) : api.create(id),
//     }),
//     ...customActions
// })