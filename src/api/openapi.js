const camelize = text => text.replace(/^([A-Z])|[\s-_]+(\w)/g, (_, p1, p2) => {
  if (p2) return p2.toUpperCase();
  return p1.toLowerCase();
});

const mapResources = (resources, maslowSchemas) => {
  const mappedResources = {};

  Object.keys(resources).forEach((method) => {
    const add = {};
    const response = resources[method].responses.default;
    const params = resources[method].parameters || [];

    if (response) {
      let schema = null;
      let isArray = false;

      if (response.schema.items || response.schema.$ref) {
        if (response.schema.items) {
          schema = response.schema.items.$ref;
          isArray = true;
        } else {
          schema = response.schema.$ref;
        }

        schema = maslowSchemas[schema.split('/').reverse()[0]];

        if (isArray) {
          add.transformResponse = data => data.map(schema);
        } else {
          add.transformResponse = schema;
        }
      }
    }

    params.forEach((param) => {
      if (param.in === 'body') {
        let schema;

        if (param.schema.$ref) {
          schema = maslowSchemas[param.schema.$ref.split('/').reverse()[0]];
        } else {
          schema = x => x;
        }

        add.transformRequest = body => schema(body);
      }
    });

    mappedResources[method] = {
      uri: '/',
      method,
      ...add,
    };
  });

  return mappedResources;
};

const innerSet = (config, [path, ...paths], entity, value, deep) => {
  const rentity = entity.replace(/{|}/g, '');

  if (!path) {
    // eslint-disable-next-line
    config[camelize(rentity)] = value;
    return;
  }

  const rpath = path.replace(/{|}/g, '');

  if (rentity === '') {
    if (deep === 0) {
      // eslint-disable-next-line
      value.uri = `/${rpath}`;
    }

    // eslint-disable-next-line
    config[camelize(rpath)] = value;
    return;
  }

  if (paths.length === 0) {
    if (!config[camelize(rpath)]) {
      // eslint-disable-next-line
      config[camelize(rpath)] = {}
    }

    // eslint-disable-next-line
    config[camelize(rpath)][camelize(rentity)] = value;
    return;
  }

  innerSet(config[rpath], paths, rentity, value, deep + 1);
};

export const parseOpenAPItoMaslowConfig = (openApiFile, maslowSchemas) => {
  const maslowConfig = {};

  Object.keys(openApiFile.paths).forEach((path) => {
    const [entity, ...paths] = path.replace(/^\/|\/$/g, '').split('/').reverse();

    innerSet(maslowConfig, paths.reverse(), entity, {
      uri: `/${entity}`,
      resources: mapResources(openApiFile.paths[path], maslowSchemas),
    }, 0);
  });

  return maslowConfig;
};

export default {
  parseOpenAPItoMaslowConfig,
};
