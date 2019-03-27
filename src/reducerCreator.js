import clone from 'fast-clone';

const baseInitialState = {
    fetchState: 'fresh',
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
        [types.domainFetchState]: (state) => ({
            ...state,
            fetchState: 'fetching',
        }),
        [types.domainFetchError]: (state, payload) => ({
            ...state,
            fetchState: 'failed',
            errors: payload,
        })
    };

    const setFetchTrue = (reducerFn, fetchState) => (state, payload) => {
        const newState = {...reducerFn(state, payload)};
        newState.fetchState = fetchState;

        return newState;
    };

    const reducerMap = {
        ..._reducerMap,
        [types.getDetail.success]: setFetchTrue(_reducerMap[types.set], 'detailFetched'),
        [types.getList.success]: setFetchTrue(_reducerMap[types.setAll], 'listFetched'),
        [types.save.success]: setFetchTrue(_reducerMap[types.set], 'saveFetched'),
        [types.remove.success]: setFetchTrue(_reducerMap[types.clearState], 'removeFetched'),
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