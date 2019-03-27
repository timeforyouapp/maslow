jest.unmock();

import { ModuleCreator, createStoreByModules, _createActionFn } from '../src/index';
import { FAKE_API } from './helpers/mocks';

describe('index', () => {
    const modlName = 'User';
    let fakeUserApi = {};

    beforeEach(() => {
        fakeUserApi = FAKE_API(jest);
    });

    const checkCallOutsFor = ({
        api,
        fakeUserEntry = 'foo',
        userEntryCheck,
        stateCheck = () => false,
        action,
        expectProp,
    }, cb) => {
        const fakeUserReturn = 'bar';
        fakeUserApi[api].mockReturnValue(Promise.resolve(fakeUserReturn));

        const userModl = ModuleCreator(modlName, fakeUserApi);
        const store = createStoreByModules([ userModl ]);

        if (action) {
            store.dispatch(userModl.actions[action](fakeUserEntry));
        }

        setTimeout(function () {
            const state = store.getState();
            const prop = modlName.toLowerCase();

            expect(state).toHaveProperty(prop);

            stateCheck ? stateCheck(state[prop]) : expect(state[prop]).toHaveProperty(expectProp, fakeUserReturn);
            userEntryCheck ? userEntryCheck(fakeUserApi[api]) : expect(fakeUserApi[api]).toHaveBeenCalledWith(fakeUserEntry);

            cb();
        }, 300);
    }

    it('should create a common redux store', (done) => {
        const fakeUserEntry = { data: 'foo' };

        checkCallOutsFor({
            fakeUserEntry,
            api: 'create',
            action: 'saveUser',
            expectProp: 'detail',
            userEntryCheck: (mock) => expect(mock).toHaveBeenCalledWith(fakeUserEntry),
        }, done);
    });

    it('should update a common redux store', (done) => {
        const fakeUserEntry = { data: 'foo', id: 'bar' };
        const { id, ...data } = fakeUserEntry;

        checkCallOutsFor({
            fakeUserEntry,
            api: 'update',
            action: 'saveUser',
            expectProp: 'detail',
            userEntryCheck: (mock) => expect(mock).toHaveBeenCalledWith(id, data),
        }, done);
    });

    it('should getDetail a common redux store', (done) => {
        checkCallOutsFor({
            api: 'getDetail',
            action: 'getUserDetail',
            expectProp: 'detail',
        }, done);
    });

    it('should getList a common redux store', (done) => {
        checkCallOutsFor({
            api: 'getList',
            action: 'getUserList',
            expectProp: 'list',
        }, done);
    });

    it('should remove a common redux store', (done) => {
        checkCallOutsFor({
            api: 'remove',
            action: 'removeUser',
            stateCheck: (state) => {
                expect(state).toHaveProperty('list', []);
                expect(state).toHaveProperty('detail', {});
                expect(state).toHaveProperty('errors', []);
                expect(state).toHaveProperty('fetchState', 'removeFetched');
            }
        }, done);
    });

    it('should exec inner actions', () => {
        const fakeStore = { dispatch: jest.fn() };
        const fakeEntry = 'foo';
        const actionName = 'bar';
        const fakeActionReturn = 'foobar';
        const realActionName = `${actionName}${modlName}`;
        const action = jest.fn().mockReturnValue(fakeActionReturn);
        const dispatchAction = _createActionFn(fakeStore, {
            [modlName]: {
                [realActionName]: action
            }
        });

        const exec = dispatchAction(actionName, modlName);
        exec(fakeEntry);

        expect(action).toHaveBeenCalledWith(fakeEntry);
        expect(fakeStore.dispatch).toHaveBeenCalledWith(fakeActionReturn);
    });
});