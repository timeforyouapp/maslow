import { ActionCreator } from 'actionCreator.js';
import { ReducerCreator } from 'reducerCreator.js';

const ModuleCreator = (name, { initialState = {}, customActionTypes = {}, customReducers = {}, customActions = {} }) => {
  const upperName = name.toUpperCase();
  const baseTypes = {
    setType: `SET_${upperName}`,
    setAll: `SET_ALL_${upperName}`,
    clearState: `CLEAR_${upperName}_STATE`,
    domainFetching: `${upperName}_FETCHING`,
    domainFetchError: `${upperName}_FETCH_ERROR`,
    domainFetchSuccess: `${upperName}_FETCH_SUCCESS`,
  }
  
  const CreateApiActions = (key) => {
    const actions = {
      success: baseTypes.domainFetching,
      fetching: baseTypes.domainFetching,
      error: baseTypes.domainFetchError
    }
    
    const template = [
      { key: 'fetching', act: `${key}Fetching` },
      { key: 'error', act: `${key}FetchError` },
      { key: 'success', act: `${key}FetchSuccess` },
    ]
    
    template.forEach((data) => {
      const customAct = customActionTypes[data[act]];
      if (customAct) {
        actions[data[key]] = customAct
      }
    });
  
    return actions;
  };
  
  
  const actionTypes = {
    ...baseTypes,
    getDetailActions: CreateApiActions('getDetail'),
    getListActions: CreateApiActions('getList'),
    saveActions: CreateApiActions('save'),
    deleteActions: CreateApiActions('delete'),
  }
 
  return {
    actionTypes,
    actions: ActionCreator(name, defaultStates, customActions),
    reducer: ReducerCreator(name, defaultStates, initialState, customReducers),
  }
}