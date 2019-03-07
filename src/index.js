import { combineReducers, createStore, applyMiddleware } from 'redux';

import { apiMiddleware, affectMiddleware } from './middlewares';

import actionCreator from './actionCreator';
import moduleCreator from './moduleCreator';
import reducerCreator from './reducerCreator';

export const ActionCreator = actionCreator;
export const ModuleCreator = moduleCreator;
export const ReducerCreator = reducerCreator;

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
};