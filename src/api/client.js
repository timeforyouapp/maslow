const mapResources = (api, uri, resources) => {
  const r = {};

  Object.keys(resources).forEach((key) => {
    r[key] = (body = {}) => {
      const re = resources[key];
      const treq = re.transformRequest || (d => d);
      const tres = re.transformResponse || (d => d);

      const finalBody = treq(body);
      const execValidate = finalBody.validate
        ? finalBody.validate
        : () => Promise.resolve();


      return execValidate().then(() => api[re.method](
        `${uri}${re.uri}`,
        finalBody.extractValues ? finalBody.extractValues() : finalBody,
      ).then(tres));
    };
  });

  return r;
};


const client = (api, { uri, resources = {}, ...innerPaths }) => {
  const mappedInnerPaths = {};

  Object.keys(innerPaths).forEach((pathProp) => {
    const path = (innerPaths[pathProp] || {}).uri ? innerPaths[pathProp].uri.replace('/', '') : pathProp;

    if (!innerPaths[pathProp].uri) {
      if (Object.keys(innerPaths[pathProp]).length !== 0) {
        mappedInnerPaths[pathProp] = client(api, {
          ...innerPaths[pathProp],
          uri: `${uri}/${path}`,
        });
      }

      return;
    }

    if (innerPaths[pathProp].uri.match(/{.*}/g)) {
      mappedInnerPaths[pathProp] = value => client(api, {
        ...innerPaths[pathProp],
        uri: `${uri}/${value}`,
      });
    } else {
      mappedInnerPaths[pathProp] = client(api, {
        ...innerPaths[pathProp],
        uri: `${uri}/${path}`,
      });
    }
  });

  return {
    ...mappedInnerPaths,
    ...mapResources(api, uri, resources),
  };
};

export const MaslowClient = (api, config) => {
  const cli = {};

  Object.keys(config).forEach((key) => {
    cli[key] = client(api, config[key]);
  });

  return cli;
};

export default MaslowClient;
