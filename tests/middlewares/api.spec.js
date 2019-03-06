import apiMiddleware from '../../src/middlewares/api';

describe('src/middleware/api', () => {
    let dispatchMock = null;
    let nextMock = null;
    let dispatcher = null;

    beforeEach(() => {
        dispatchMock = jest.fn();
        nextMock = jest.fn();
        dispatcher = apiMiddleware({
            dispatch: dispatchMock
        })(nextMock)
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    it('should call next directly', () => {
        const fakeActionType = 'foo';
        const fakeAction = { type: fakeActionType };

        dispatcher(fakeAction);

        expect(dispatchMock).not.toHaveBeenCalled();
        expect(nextMock).toHaveBeenCalledWith(fakeAction);
    });

    it('should call a api success with string type', () => {
        const fakeActionType = 'foo';
        const fakeReturn = 'bar';

        const fakeAction = {
            type: fakeActionType,
            api: jest.fn().mockReturnValue(
                Promise.resolve(fakeReturn)
            ),
        };

        return dispatcher(fakeAction).then(() => {
            expect(nextMock).not.toHaveBeenCalledWith(fakeAction);
            expect(fakeAction.api).toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                type: fakeAction.type,
                payload: fakeReturn,
            });
        });
    });

    describe('> full cycle', () => {
        const fakeReturn = 'test';
        const fakeActionType = {
            fetching: 'bar',
            success: 'foobar',
            error: 'foo',
        };


        it('should call complete with success', () => {
            const fakeAction = {
                types: fakeActionType,
                payload: 'test2',
                api: jest.fn().mockReturnValue(
                    Promise.resolve(fakeReturn)
                ),
            };

            return dispatcher(fakeAction).then(() => {
                expect(nextMock).not.toHaveBeenCalledWith(fakeAction);
                expect(fakeAction.api).toHaveBeenCalledWith(fakeAction.payload);
                expect(dispatchMock).toHaveBeenCalledWith({
                    type: fakeActionType.fetching,
                    payload: fakeAction.payload,
                });
                expect(dispatchMock).toHaveBeenCalledWith({
                    type: fakeActionType.success,
                    payload: fakeReturn,
                });
            });
        });

        it('should call complete with error', () => {
            const fakeAction = {
                type: fakeActionType,
                api: jest.fn().mockReturnValue(
                    Promise.reject(fakeReturn)
                ),
            };

            return dispatcher(fakeAction).then((error) => {
                expect(error).toBe(fakeReturn);
                expect(nextMock).not.toHaveBeenCalledWith(fakeAction);
                expect(fakeAction.api).toHaveBeenCalled();
                expect(dispatchMock).toHaveBeenCalledWith({
                    type: fakeActionType.fetching,
                    payload: fakeAction.payload,
                });
                expect(dispatchMock).toHaveBeenCalledWith({
                    type: fakeActionType.error,
                    payload: fakeReturn,
                });
            });
        });

        it('should call complete with error', () => {
            const fakeAction = {
                type: fakeActionType,
                api: jest.fn().mockReturnValue(
                    Promise.reject(fakeReturn)
                ),
            };

            delete fakeAction.type.error;

            return dispatcher(fakeAction).then((error) => {
                expect(error).toBe(fakeReturn);
                expect(nextMock).not.toHaveBeenCalledWith(fakeAction);
                expect(fakeAction.api).toHaveBeenCalled();
                expect(dispatchMock).toHaveBeenCalledWith({
                    type: fakeActionType.fetching,
                    payload: fakeAction.payload,
                });
                expect(dispatchMock).not.toHaveBeenCalledWith({
                    type: fakeActionType.error,
                    payload: fakeReturn,
                });
            });
        });
    })
});