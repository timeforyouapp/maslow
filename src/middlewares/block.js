export const blockMiddleware = store => next => (action) => {
    if (action.ignoreBlock) {
        return next(action);
    }

    if (
        store.__block__ &&
        typeof action.type === 'string' &&
        store.__block__.until === action.type
    ) {
        const futureActions = !store.__block__.ignoreMatchs ?
            store.__block__.actions :
            store.__block__.actions.filter((action) => {
                if (action.api) {
                    return true;
                }

                if (action.type.match(store.__block__.ignoreMatchs)) {
                    return true;
                }

                return false;
            })


        action.ignoreBlock = true;
        next(action);

        store.__block__ = null;
        return futureActions.forEach((fa) => {
            next(fa);
        });
    }

    if (store.__block__) {
        store.__block__.actions.push(action);
    }

    if (!store.__block__ && action.blockUntil) {
        store.__block__ = {
            until: action.blockUntil,
            ignoreMatchs: action.blockIgnoreNextsMatchs,
            actions: [],
        }

        delete action.blockUntil;
    }

    next(action);
};

export default blockMiddleware;
