import joi from 'joi-browser';
import { ReadOnlyProp, MethodNotAFunction } from '../error';

const camelize = text => text.replace(/^([A-Z])|[\s-_]+(\w)/g, (_, p1, p2) => {
  if (p2) return p2.toUpperCase();
  return p1.toLowerCase();
});

export const createJoiValidator = (propInfo, isRequired) => {
  let validator = null;

  if (propInfo.$ref) {
    const entity = propInfo.$ref.split('/').reverse()[0];
    return entity;
  }

  if (propInfo.readOnly) {
    return joi.any();
  }

  if (propInfo.format) {
    switch (propInfo.format) {
      case 'date':
      case 'date-time': {
        validator = joi.date();
        break;
      }
      default: {
        break;
      }
    }
  }

  if (propInfo.type === 'string' && !propInfo.format) {
    validator = joi.string();

    if (propInfo.maxLength) {
      validator = validator.max(propInfo.maxLength);
    }
  }

  if (propInfo.type === 'integer') {
    validator = joi.number().integer();
  }

  if (propInfo.type === 'number') {
    validator = joi.number();
  }

  if (propInfo.type === 'boolean') {
    validator = joi.boolean();
  }

  if (propInfo.type === 'array') {
    validator = joi.array().items(
      createJoiValidator(propInfo.items),
    );
  }

  if (propInfo.type === 'object') {
    validator = joi.object();
  }

  if (isRequired) {
    validator = validator.required();
  } else {
    validator = validator.allow('');
  }

  return validator;
};

export const createNodeSchema = (properties, requiredFields) => {
  const schema = {};

  Object.keys(properties).forEach((prop) => {
    const propInfo = properties[prop];
    const parsedProp = camelize(prop);
    schema[parsedProp] = createJoiValidator(propInfo, requiredFields.indexOf(prop) !== -1);
  });

  return schema;
};

export function MaslowSchema({ properties, required = []}) {
  let otherSchemas = null;
  let globalJoiValidator = null;
  const schemaItems = createNodeSchema(properties, required);
  const methods = {
    parse: values => values,
  };

  function initSchema(values, data) {
    const innerValues = {};
    const innerMethods = {};
    const readOnly = [];
    let next = null;
    const prev = data ? data.prevState : null;

    Object.keys(schemaItems).forEach((key) => {
      if (typeof schemaItems[key] === 'string') {
        schemaItems[key] = otherSchemas[schemaItems[key]].getJoiSchema();
      }

      if (schemaItems[key].describe && schemaItems[key].describe().type === 'any') {
        readOnly.push(key);
      }

      if (values[key] === undefined) {
        return;
      }

      innerValues[key] = values[key];
    });

    Object.keys(methods).forEach((key) => {
      innerMethods[key] = (...parameters) => methods[key].call({
        ...innerValues,
        ...innerMethods,
      }, ...parameters);
    });

    function setInnerValue(prop, value) {
      if (properties[prop].readOnly) {
        throw ReadOnlyProp();
      }

      innerValues[prop] = value;
    }

    return Object.freeze({
      ...innerValues,
      ...innerMethods,
      prev() {
        return prev;
      },
      next() {
        return next;
      },
      set(prop, value) {
        setInnerValue(prop, value);
        next = initSchema(innerValues, { prevState: this });
        return next;
      },
      update(newValues) {
        Object.keys(properties).forEach((prop) => {
          if (newValues[prop]) {
            setInnerValue(prop, newValues[prop]);
          }
        });

        next = initSchema(innerValues, { prevState: this });
        return next;
      },
      extractValues() {
        return methods.parse({ ...innerValues });
      },
      validate() {
        return new Promise((resolve) => {
          let schema = joi.object(schemaItems).options({ abortEarly: false });
          const validValues = {};

          if (globalJoiValidator) {
            schema = globalJoiValidator(joi, schema);
          }

          const realValues = methods.parse({ ...innerValues });
          Object.keys(innerValues).forEach((key) => {
            if (readOnly.indexOf(key) > -1) {
              return;
            }

            validValues[key] = realValues[key];
          });

          resolve(joi.assert(validValues, schema));
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

          throw errors;
        });
      },
    });
  }

  initSchema.getJoiSchema = function getJoiSchema() {
    return schemaItems;
  };

  initSchema.addMethod = function addMethod(methodName, callback) {
    if (typeof callback !== 'function') {
      throw MethodNotAFunction();
    }

    methods[methodName] = callback;
  };

  initSchema.setSchemas = function setSchemas(os) {
    otherSchemas = os;
  };

  initSchema.setCustomValidator = (validatorsFactory) => {
    const validators = typeof validatorsFactory === 'function' ? validatorsFactory(joi) : validatorsFactory;
    Object.keys(validators).forEach((key) => {
      schemaItems[key] = validators[key](schemaItems[key]);
    });
  };

  initSchema.setGlobalValidator = (validator) => {
    globalJoiValidator = validator;
  };

  return initSchema;
}


export default MaslowSchema;
