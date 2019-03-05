jest.mock('../src/actionCreator');
jest.mock('../src/reducerCreator');

import ModuleCreator from '../src/moduleCreator';
import { FAKE_API } from './helpers/mocks';

import ActionCreator from '../src/actionCreator';
import ReducerCreator from '../src/reducerCreator';

describe('moduleCreator', () => {
    const modlName = 'User';
    let fakeUserApi = {};
    let expectedActionTypes = {};

    beforeEach(() => {
        fakeUserApi = FAKE_API(jest);
        expectedActionTypes = {
            "setType": "SET_USER",
            "setAll": "SET_ALL_USER",
            "clearState": "CLEAR_USER_STATE",
            "domainFetching": "USER_FETCHING",
            "domainFetchError": "USER_FETCH_ERROR",
            "domainFetchSuccess": "USER_FETCH_SUCCESS",
            "getDetailActions": {
                "success": "USER_FETCHING",
                "fetching": "USER_FETCHING",
                "error": "USER_FETCH_ERROR"
            },
            "getListActions": {
                "success": "USER_FETCHING",
                "fetching": "USER_FETCHING",
                "error": "USER_FETCH_ERROR"
            },
            "saveActions": {
                "success": "USER_FETCHING",
                "fetching": "USER_FETCHING",
                "error": "USER_FETCH_ERROR"
            },
            "deleteActions": {
                "success": "USER_FETCHING",
                "fetching": "USER_FETCHING",
                "error": "USER_FETCH_ERROR"
            }
        }
    })

    it('check base module creation', () => {
        const userModl = ModuleCreator(modlName, fakeUserApi);

        expect(ActionCreator).toHaveBeenCalledWith(modlName, expectedActionTypes, fakeUserApi, {});
        expect(ReducerCreator).toHaveBeenCalledWith(expectedActionTypes, {}, {});
        expect(userModl).toHaveProperty('actionTypes', expectedActionTypes);
    });

    it('check with a custom reducer', () => {
        const customReducerName = 'test';
        const customReducers = {
            [customReducerName]: 'bar',
        }

        const userModl = ModuleCreator(modlName, fakeUserApi, { customReducers });

        expect(ActionCreator).toHaveBeenCalledWith(modlName, expectedActionTypes, fakeUserApi, {});
        expect(ReducerCreator).toHaveBeenCalledWith(expectedActionTypes, {}, customReducers);
        expect(userModl).toHaveProperty('actionTypes', expectedActionTypes);
    });

    it('check with a custom action', () => {
        const customActionName = 'test';
        const customActions = {
            [customActionName]: 'bar',
        }

        const userModl = ModuleCreator(modlName, fakeUserApi, { customActions });

        expect(ActionCreator).toHaveBeenCalledWith(modlName, expectedActionTypes, fakeUserApi, customActions);
        expect(ReducerCreator).toHaveBeenCalledWith(expectedActionTypes, {}, {});
        expect(userModl).toHaveProperty('actionTypes', expectedActionTypes);
    });

    it('check with a custom action type', () => {
        const customActionTypeName = 'CUSTOM_ACTION';
        const customActionTypes = {
            getListFetchSuccess: customActionTypeName,
        }

        const userModl = ModuleCreator(modlName, fakeUserApi, { customActionTypes });

        expectedActionTypes.getListActions.success = customActionTypeName;

        expect(ActionCreator).toHaveBeenCalledWith(modlName, expectedActionTypes, fakeUserApi, {});
        expect(ReducerCreator).toHaveBeenCalledWith(expectedActionTypes, {}, {});
        expect(userModl).toHaveProperty('actionTypes', expectedActionTypes);
    });
 });