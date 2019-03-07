export const affectMiddleware = store => next => action => {
    const actionSideEffects = action.affect || {};

    (actionSideEffects.pre || []).forEach((sideEffect) => {
        store.dispatch(sideEffect);
    });

    next(action);

    (actionSideEffects.post || []).forEach((sideEffect) => {
        store.dispatch(sideEffect);
    });
};

export default affectMiddleware;
