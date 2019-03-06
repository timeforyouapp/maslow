import affectMiddleware from '../../src/middlewares/affect';

describe('src/middleware/affect', () => {
    let dispatchMock = null;
    let nextMock = null;
    let dispatcher = null;
    let affectAction = null;

    beforeEach(() => {
        affectAction = { type: 'bar' };
        dispatchMock = jest.fn();
        nextMock = jest.fn();
        dispatcher = affectMiddleware({
            dispatch: dispatchMock
        })(nextMock)
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should called next without side effects', () => {
        const fakeAction = { type: 'foo' };
        dispatcher(fakeAction);

        expect(nextMock).toHaveBeenCalledWith(fakeAction);
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should called next with pre side', () => {
        const fakeAction = { type: 'foo', affect: { pre: [affectAction] } };
        dispatcher(fakeAction);

        expect(nextMock).toHaveBeenCalledWith(fakeAction);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(affectAction);
    });

    it('should called next with post side', () => {
        const fakeAction = { type: 'foo', affect: { post: [affectAction] } };
        dispatcher(fakeAction);

        expect(nextMock).toHaveBeenCalledWith(fakeAction);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(affectAction);
    });
});