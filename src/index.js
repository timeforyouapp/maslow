import { combineReducers, createStore, applyMiddleware } from 'redux';

import { apiMiddleware, affectMiddleware, blockMiddleware } from './middlewares';

import actionCreator from './actionCreator';
import moduleCreator from './moduleCreator';
import reducerCreator from './reducerCreator';

export const ActionCreator = actionCreator;
export const ModuleCreator = moduleCreator;
export const ReducerCreator = reducerCreator;

export { MaslowAPI } from './api';
export { AxiosWrapper } from './api/axios';
export { MaslowClient } from './api/client';
export { MaslowSchema } from './api/schemas';
export { parseOpenAPItoMaslowConfig } from './api/openapi';

export * from './connectors/formConnector';
export * from './connectors/listConnector';

export const createActionFn = (
  indexedActions
) => (
  store,
) => (
  actionName, namespace,
) => (
  ...parameters
) => {
  const actions = indexedActions[namespace];
  const action = actions[`${actionName}${namespace}`];
  return store.dispatch(action(...parameters));
};

export const createStoreByModules = (
  modules,
  {
    middlewares = [],
    enhancers = [],
    schemas = {},
    api,
  } = {},
) => {
  const reducers = {};
  const indexedActions = {};

  modules.forEach((modl) => {
    indexedActions[modl.name] = modl.actions;
    reducers[modl.name.toLowerCase()] = modl.reducer;
  });

  const actionMaker = createActionFn(indexedActions);

  let finalMiddleware = applyMiddleware(...[
    blockMiddleware,
    apiMiddleware(api, actionMaker),
    affectMiddleware,
    ...middlewares,
  ]);

  // @TODO: Fix Enhancers
  enhancers.forEach((enhancer) => {
    finalMiddleware = enhancer(finalMiddleware);
  });

  const store = createStore(combineReducers(reducers), {}, finalMiddleware);

  store.dispatch.action = actionMaker(store);
  store.dispatch.validate = entity => data => schemas[entity](data).validate();
  store.dispatch.api = api;

  return store;
};
