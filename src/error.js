export const ReadOnlyProp = () => new Error('You can`t set a ReadOnly field');

export const MethodNotAFunction = () => new Error('Schema method need to be a Function');

export default {
  ReadOnlyProp,
  MethodNotAFunction,
};
