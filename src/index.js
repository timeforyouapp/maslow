import { combineReducers, createStore } from 'redux'


export const createStoreByModules = (modules) => {
    const reducers = {};

    modules.forEach((modl) => {
        reducers[modl.name.toLowerCase()] = modl.reducer;
    });

    return createStore(combineReducers(reducers));
}

export * from './actionCreator';
export * from './moduleCreator';
export * from './reducerCreator';