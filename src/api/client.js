const mapResources = (api, uri, resources) => {
    const r = {};

    Object.keys(resources).forEach((key) => {
        r[key] = (...parameters) => {
            const re = resources[key];
            const tr = re.transformResponse || ((d) => d);

            return api[re.method](`${uri}${re.uri}`, ...parameters).then(tr);
        };
    });

    return r;
};


const client = (api, { uri, resources, ...innerPaths }) => {
    const mappedInnerPaths = {};

    Object.keys(innerPaths).forEach((path) => {
        if (innerPaths[path].uri.match(/{.*}/g)) {
            mappedInnerPaths[path] = (value) => client(api, {
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
