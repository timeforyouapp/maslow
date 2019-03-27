import clone from 'fast-clone';
import ReducerCreator from '../src/reducerCreator';
import { FAKE_TYPES } from './helpers/mocks';

describe('reducerCreator', () => {
    let fakeTypes = null;

    const checkInitialState = (state, fetchState = 'fresh') => {
        expect(state).toHaveProperty('fetchState', fetchState);
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
        expect(newState).toHaveProperty('fetchState', 'failed');
        expect(newState).toHaveProperty('errors', fakePayload);
    });

    it('check reducer default domainFetchState fn', () => {
        const reducer = ReducerCreator(fakeTypes);
        const fakePayload = 'fakePayload';

        const state = reducer(undefined, {});
        const newState = reducer(state, {
            type: fakeTypes.domainFetchState
        })

        checkInitialState(state);
        expect(newState).toHaveProperty('fetchState', 'fetching');
    });

    it('check reducer default domainFetchState fn', () => {
        const reducer = ReducerCreator(fakeTypes);

        const state = reducer(undefined, {});
        const newState = reducer(state, {
            type: fakeTypes.domainFetchState
        })

        checkInitialState(state);
        expect(newState).toHaveProperty('fetchState', 'fetching');
    });

    it('check generated fetch functions as getDetail', () => {
        const reducer = ReducerCreator(fakeTypes);
        const fakePayload = 'fakePayload';

        const state = reducer(undefined, {});
        const newState = reducer(state, {
            type: fakeTypes.getDetail.success,
            payload: fakePayload,
        })

        checkInitialState(state);
        expect(newState).toHaveProperty('fetchState', 'detailFetched');
        expect(newState).toHaveProperty('detail', fakePayload);
    });
 });