import clone from 'fast-clone';
import { ModuleCreator, createStoreByModules } from '../src/index';
import {
    FAKE_TYPES,
    FAKE_API,
} from './helpers/mocks';

describe('index', () => {
    const modlName = 'User';
    let fakeUserApi = {};

    beforeEach(() => {
        fakeUserApi = FAKE_API(jest);
    });

    it('should create a common redux store', () => {
        const userModl = ModuleCreator(modlName, fakeUserApi);
        const store = createStoreByModules([ userModl ]);

        // const fakeUserEntry = 'foo';
        // const fakeUserReturn = 'bar';
        // fakeUserApi.create.mockReturnValue(Promise.resolve(fakeUserReturn));

        // console.log(userModl.actions.saveUser());
        expect(store.getState()).toHaveProperty(modlName.toLowerCase());
        // store.dispatch(userModl.actions.saveUser(fakeUserEntry));

        // console.log(store.getState())
    });
});