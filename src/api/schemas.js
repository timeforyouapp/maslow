import joi from 'joi-browser';

const camelize = (text) => {
    return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(_, p1, p2) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();        
    });
};

export const createNodeSchema = ({ properties }) => {
    const schema = {};

    Object.keys(properties).forEach((prop) => {
        const propInfo = properties[prop];
        const parsedProp = camelize(prop);

        if (propInfo.format) {
            switch(propInfo.format) {
            case 'date-time': {
                schema[parsedProp] = joi.date();
                break;
            }
            }
        }

        if (propInfo.type === 'string' && !propInfo.format) {
            schema[parsedProp] = joi.string().min(propInfo.minLength || 0);

            if (propInfo.maxLength) {
                schema[parsedProp] = schema[parsedProp].max(propInfo.maxLength);
            }
        }

        if (propInfo.type === 'integer') {
            schema[parsedProp] = joi.number().integer();
        }

        if (propInfo.type === 'number') {
            schema[parsedProp] = joi.number();
        }

        if (!propInfo['x-nullable']) {
            schema[parsedProp] = schema[parsedProp].required();
        }
    });

    return schema;
};

export const MaslowSchema = function (definition) {
    const schemaItems = createNodeSchema(definition);
    const methods = {
        parse: (values) => values
    };

    function initSchema(values, data) {
        const innerValues = {};
        const innerMethods = {};
        let next = null;
        let prev = data ? data.__prev__ : null;

        Object.keys(schemaItems).forEach((key) => {
            if (values[key] === undefined) {
                return;
            }

            innerValues[key] = values[key];
        });

        Object.keys(methods).forEach((key) => {
            innerMethods[key] = (...parameters) => {
                return methods[key].call({
                    ...innerValues,
                    ...innerMethods,
                }, ...parameters);
            };
        });

        function setInnerValue(prop, value) {
            if (definition.properties[prop].readOnly) {
                throw 'read only prop';
            }

            innerValues[prop] = value;
        }

        return Object.freeze({
            ...innerValues,
            ...innerMethods,
            prev: function () {
                return prev;
            },
            next: function () {
                return next;
            },
            set: function (prop, value) {
                setInnerValue(prop, value);
                next = initSchema(innerValues, { __prev__: this });
                return next;
            },
            update: function (newValues) {
                Object.keys(definition.properties).forEach((prop) => {
                    if (newValues[prop]) {
                        setInnerValue(prop, newValues[prop]);
                    }
                });

                next = initSchema(innerValues, { __prev__: this });
                return next;
            },
            extractValues: function () {
                return methods.parse({...innerValues});
            },
            validate: function () {
                return new Promise((resolve) => {
                    resolve(
                        joi.assert(innerValues, joi.object(schemaItems).options({ abortEarly: false }))
                    );
                }).catch((joiErrors) => {
                    const errors = {};

                    joiErrors.details.forEach((e) => {
                        const path = e.path[0];
                        if (!errors[path]) {
                            errors[path] = [];
                        }

                        errors[path].push({
                            type: e.type.split('.')[1],
                            ...e.context,
                            _message: e.message,
                        });
                    });

                    return errors;
                });
            }
        });
    }

    initSchema.addMethod = function (methodName, callback) {
        if (typeof callback !== 'function') {
            throw 'not function';
        }

        methods[methodName] = callback;
    };

    return initSchema;
};


export default MaslowSchema;