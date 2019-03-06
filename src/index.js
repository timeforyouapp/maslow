import { combineReducers, createStore, applyMiddleware } from 'redux'

import { apiMiddleware, affectMiddleware } from './middlewares';

export const createStoreByModules = (modules, middlewares = []) => {
    const reducers = {};

    modules.forEach((modl) => {
        reducers[modl.name.toLowerCase()] = modl.reducer;
    });

    return createStore(combineReducers(reducers), {}, applyMiddleware(...[
        apiMiddleware,
        affectMiddleware,
        ...middlewares
    ]));
}

export * from './actionCreator';
export * from './moduleCreator';
export * from './reducerCreator';