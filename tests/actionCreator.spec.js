
import clone from 'fast-clone';
import { ActionCreator } from '../src/actionCreator';
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
    expect(actions).toHaveProperty(`remove${fakeName}`);

    result = actions[`_set${fakeName}`](fakeEntry);
    expect(result).toHaveProperty('type', fakeTypes.set);
    expect(result).toHaveProperty('payload', fakeEntry);

    result = actions[`_setAll${fakeName}`](fakeEntry);
    expect(result).toHaveProperty('type', fakeTypes.setAll);
    expect(result).toHaveProperty('payload', fakeEntry);

    result = actions[`_clear${fakeName}State`](fakeEntry);
    expect(result).toHaveProperty('type', fakeTypes.clearState);

    result = actions[`get${fakeName}Detail`](fakeEntry);
    result.api(fakeEntry);
    expect(fakeApi.getDetail).toHaveBeenCalledWith(fakeEntry);
    expect(result).toHaveProperty('type', fakeTypes.getDetail);
    expect(result).toHaveProperty('payload', fakeEntry);

    result = actions[`get${fakeName}List`](fakeEntry);
    result.api(fakeEntry);
    expect(fakeApi.getList).toHaveBeenCalledWith(fakeEntry);
    expect(result).toHaveProperty('type', fakeTypes.getList);
    expect(result).toHaveProperty('payload', fakeEntry);

    const fakeUserCreate = { fakeEntry };
    result = actions[`save${fakeName}`](fakeEntry);
    result.api(fakeUserCreate);
    expect(fakeApi.create).toHaveBeenCalledWith(fakeUserCreate);
    expect(result).toHaveProperty('type', fakeTypes.save);
    expect(result).toHaveProperty('payload', fakeEntry);

    const fakeUserUpdate = { id: fakeEntry2, fakeEntry };
    result = actions[`save${fakeName}`](fakeEntry, fakeEntry2);
    result.api(fakeUserUpdate);
    expect(fakeApi.update).toHaveBeenCalledWith(fakeEntry2, { fakeEntry });
    expect(result).toHaveProperty('type', fakeTypes.save);
    expect(result).toHaveProperty('payload', fakeEntry);

    result = actions[`remove${fakeName}`](fakeEntry);
    result.api(fakeEntry);
    expect(fakeApi.remove).toHaveBeenCalledWith(fakeEntry);
    expect(result).toHaveProperty('type', fakeTypes.remove);
    expect(result).toHaveProperty('payload', fakeEntry);
  };

  beforeEach(() => {
    fakeTypes = clone(FAKE_TYPES);
    fakeApi = FAKE_API(jest);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Check base props', () => {
    const actions = ActionCreator(fakeName, fakeTypes, fakeApi);
    checkAttributesAndExecFunctions(actions);
  });

  it('Check custom props', () => {
    const newFakeActions = 'newFakeActions';
    const actions = ActionCreator(fakeName, fakeTypes, fakeApi, {
      [newFakeActions]: x => ({
        type: newFakeActions,
        payload: x,
      }),
    });

    checkAttributesAndExecFunctions(actions);

    const result = actions[newFakeActions](fakeEntry);
    expect(actions).toHaveProperty(newFakeActions);
    expect(result).toHaveProperty('type', newFakeActions);
    expect(result).toHaveProperty('payload', fakeEntry);
  });
});
