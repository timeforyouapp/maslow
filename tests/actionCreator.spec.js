
import clone from 'fast-clone';
import ActionCreator from '../src/actionCreator';
import {
    FAKE_TYPES,
    FAKE_API,
} from './helpers/mocks';

describe('actionCreator', () => {
    const fakeName = 'Fake';
    const fakeEntry = 'fakeEntry';
    const fakeEntry2 = 'fakeEntry2';

    let fakeTypes = null;
    let fakeApi = null;

    const checkAttributesAndExecFunctions = (actions) => {
        let result = null;
        expect(actions).toHaveProperty(`_set${fakeName}`);
        expect(actions).toHaveProperty(`_setAll${fakeName}`);
        expect(actions).toHaveProperty(`_clear${fakeName}State`);
        expect(actions).toHaveProperty(`get${fakeName}Detail`);
        expect(actions).toHaveProperty(`get${fakeName}List`);
        expect(actions).toHaveProperty(`save${fakeName}`);
        expect(actions).toHaveProperty(`delete${fakeName}`);

        result = actions[`_set${fakeName}`](fakeEntry)
        expect(result).toHaveProperty('type', fakeTypes.set);
        expect(result).toHaveProperty('payload', fakeEntry);

        result = actions[`_setAll${fakeName}`](fakeEntry)
        expect(result).toHaveProperty('type', fakeTypes.setAll);
        expect(result).toHaveProperty('payload', fakeEntry);

        result = actions[`_clear${fakeName}State`](fakeEntry)
        expect(result).toHaveProperty('type', fakeTypes.clearState);

        result = actions[`get${fakeName}Detail`](fakeEntry)
        expect(result).toHaveProperty('type', fakeTypes.getDetail);
        expect(fakeApi.getDetail).toHaveBeenCalledTimes(1);
        expect(fakeApi.getDetail).toHaveBeenCalledWith(fakeEntry);

        result = actions[`get${fakeName}List`](fakeEntry)
        expect(result).toHaveProperty('type', fakeTypes.getList);
        expect(fakeApi.getList).toHaveBeenCalledTimes(1);
        expect(fakeApi.getList).toHaveBeenCalledWith(fakeEntry);

        result = actions[`save${fakeName}`](fakeEntry)
        expect(result).toHaveProperty('type', fakeTypes.create);
        expect(fakeApi.create).toHaveBeenCalledTimes(1);
        expect(fakeApi.create).toHaveBeenCalledWith(fakeEntry);

        result = actions[`save${fakeName}`](fakeEntry, fakeEntry2)
        expect(result).toHaveProperty('type', fakeTypes.update);
        expect(fakeApi.update).toHaveBeenCalledTimes(1);
        expect(fakeApi.update).toHaveBeenCalledWith(fakeEntry, fakeEntry2);

        result = actions[`delete${fakeName}`](fakeEntry)
        expect(result).toHaveProperty('type', fakeTypes.delete);
        expect(fakeApi.delete).toHaveBeenCalledTimes(1);
        expect(fakeApi.delete).toHaveBeenCalledWith(fakeEntry);
    };
    
    beforeEach(() => {
        fakeTypes = clone(FAKE_TYPES);
        fakeApi = FAKE_API(jest);
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    it('Check base props', () => {
        const actions = ActionCreator(fakeName, fakeTypes, fakeApi);
        checkAttributesAndExecFunctions(actions);
    });

    it('Check custom props', () => {
        const newFakeActions = 'newFakeActions';
        const actions = ActionCreator(fakeName, fakeTypes, fakeApi, {
            [newFakeActions]: (x) => ({
                type: newFakeActions,
                payload: x
            })
        });

        checkAttributesAndExecFunctions(actions);
        
        const result = actions[newFakeActions](fakeEntry);
        expect(actions).toHaveProperty(newFakeActions);
        expect(result).toHaveProperty('type', newFakeActions);
        expect(result).toHaveProperty('payload', fakeEntry);
    });
});