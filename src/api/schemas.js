import Schema from 'node-schema';
import str from 'string-validator';

export const createNodeSchema = ({ properties, required }) => {
    const schema = {};

    Object.keys(properties).forEach((prop) => {
        const propInfo = properties[prop];

        if (propInfo.readOnly) {
            return;
        }

        schema[prop] = {};

        if (propInfo.maxLength) {
            const minLength = propInfo.minLength || 0;
            schema[prop].invalidLength = str.isLength(minLength, propInfo.maxLength);
        }

        if (required && ~required.indexOf(prop)) {
            schema[prop].required = (value) => typeof value === 'string' && value !== '';
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
                const s = Schema(schemaItems);
                return s.validate(innerValues);
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