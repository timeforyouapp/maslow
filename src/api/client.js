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

  Object.keys(innerPaths).forEach((path) => {
    if (!innerPaths[path].uri) {
      if (Object.keys(innerPaths[path]).length !== 0) {
        mappedInnerPaths[path] = client(api, {
          ...innerPaths[path],
          uri: `${uri}/${path}`,
        });
      }

      return;
    }

    if (innerPaths[path].uri.match(/{.*}/g)) {
      mappedInnerPaths[path] = value => client(api, {
        ...innerPaths[path],
        uri: `${uri}/${value}`,
      });
    } else {
      mappedInnerPaths[path] = client(api, {
        ...innerPaths[path],
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
