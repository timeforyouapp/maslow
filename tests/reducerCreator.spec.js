import clone from 'fast-clone';
import ReducerCreator from '../src/reducerCreator';
import { FAKE_TYPES } from './helpers/mocks';

describe('reducerCreator', () => {
    let fakeTypes = null;

    const checkInitialState = (state) => {
        expect(state).toHaveProperty('fetching', false);
        expect(state).toHaveProperty('detail', {});
        expect(state).toHaveProperty('list', []);
        expect(state).toHaveProperty('errors', []);
    }

    beforeEach(() => {
        fakeTypes = { ...FAKE_TYPES };
    });

    it('check reducer with default props', () => {
        const reducer = ReducerCreator(fakeTypes);
        checkInitialState(reducer(undefined, {}))
    });

    it('check reducer default set and clear fns', () => {
        const reducer = ReducerCreator(fakeTypes);
        const fakePayload = 'fakePayload';

        const state = reducer(undefined, {});
        const newState = reducer(state, {
            type: fakeTypes.set,
            payload: fakePayload
        })

        const clearState = reducer(newState, {
            type: fakeTypes.clearState,
        })

        checkInitialState(state);
        checkInitialState(clearState);
        expect(newState).toHaveProperty('detail', fakePayload);
    });

    it('check reducer default setAll fn', () => {
        const reducer = ReducerCreator(fakeTypes);
        const fakePayload = 'fakePayload';

        const state = reducer(undefined, {});
        const newState = reducer(state, {
            type: fakeTypes.setAll,
            payload: fakePayload
        })

        checkInitialState(state);
        expect(newState).toHaveProperty('list', fakePayload);
    });

    it('check reducer default domainFetchError fn', () => {
        const reducer = ReducerCreator(fakeTypes);
        const fakePayload = 'fakePayload';

        const state = reducer(undefined, {});
        const newState = reducer(state, {
            type: fakeTypes.domainFetchError,
            payload: fakePayload
        })

        checkInitialState(state);
        expect(newState).toHaveProperty('errors', fakePayload);
    });
 });