export const affectMiddleware = store => next => (action) => {
  const actionSideEffects = action.affect || {};

  (actionSideEffects.pre || []).forEach((sideEffect) => {
    next(sideEffect);
  });

  next(action);

  (actionSideEffects.post || []).forEach((sideEffect) => {
    next(sideEffect);
  });
};

export default affectMiddleware;
