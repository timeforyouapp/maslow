import ModuleCreator from '../src/moduleCreator';
import { createStore, combineReducers } from 'redux';
import { FAKE_API } from './helpers/mocks';

describe('moduleCreator', () => {
    let fakeUserApi = {};
    let fakeBeerApi = {};

    beforeEach(() => {
        fakeUserApi = FAKE_API(jest);
        fakeBeerApi = FAKE_API(jest);
    })

    it('check base module creation', () => {
        const userModl = ModuleCreator('User', fakeUserApi);

        const store = createStore(combineReducers({
            user: userModl.reducer,
        }));

        console.log(store.getState());
    });
 });