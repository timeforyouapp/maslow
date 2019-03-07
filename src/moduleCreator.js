import ActionCreator from './actionCreator.js';
import ReducerCreator from './reducerCreator.js';

export const ModuleCreator = (name, api, {
    customInitialState = {},
    customReducers = {},
    customActions = {},
    customActionTypes = {},
} = {}) => {
    const upperName = name.toUpperCase();
    const baseTypes = {
        set: `SET_${upperName}`,
        setAll: `SET_ALL_${upperName}`,
        clearState: `CLEAR_${upperName}_STATE`,
        domainFetching: `${upperName}_FETCHING`,
        domainFetchError: `${upperName}_FETCH_ERROR`,
        domainFetchSuccess: (key) => `${upperName}_${key.toUpperCase()}_FETCH_SUCCESS`,
    };

    const CreateApiActions = (key) => {
        const actions = {
            success: baseTypes.domainFetchSuccess(key),
            fetching: baseTypes.domainFetching,
            error: baseTypes.domainFetchError
        };

        const template = [
            { key: 'fetching', act: `${key}Fetching` },
            { key: 'error', act: `${key}FetchError` },
            { key: 'success', act: `${key}FetchSuccess` },
        ];

        template.forEach((data) => {
            if (customActionTypes[data.act]) {
                actions[data.key] = customActionTypes[data.act];
            }
        });

        return actions;
    };

    const actionTypes = {
        ...baseTypes,
        getDetail: CreateApiActions('getDetail'),
        getList: CreateApiActions('getList'),
        save: CreateApiActions('save'),
        remove: CreateApiActions('remove'),
    };

    delete actionTypes.domainFetchSuccess;

    return {
        name,
        actionTypes,
        actions: ActionCreator(name, actionTypes, api, customActions),
        reducer: ReducerCreator(actionTypes, customInitialState, customReducers),
    };
};

export default ModuleCreator;