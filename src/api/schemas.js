import joi from 'joi-browser';

export const createNodeSchema = ({ properties, required }) => {
    const schema = {};

    Object.keys(properties).forEach((prop) => {
        const propInfo = properties[prop];

        if (propInfo.format) {
            switch(propInfo.format) {
                case 'date-time': {
                    schema[prop] = joi.date();
                    break;
                }
            }
        }

        if (propInfo.type === 'string' && !propInfo.format) {
            schema[prop] = joi.string().min(propInfo.minLength || 0);

            if (propInfo.maxLength) {
                schema[prop] = schema[prop].max(propInfo.maxLength);
            }
        }

        if (propInfo.type === 'integer') {
            schema[prop] = joi.number().integer();
        }

        if (propInfo.type === 'number') {
            schema[prop] = joi.number();
        }

        if (!propInfo['x-nullable']) {
            schema[prop] = schema[prop].required();
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

        Object.keys(definition.properties).forEach((key) => {
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