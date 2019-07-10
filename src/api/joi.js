import baseJoi from 'joi-browser';

export let joi = baseJoi;

export const extendFn = (fn) => {
    joi = joi.extend(fn);
}