const mapResources = (resources, maslowSchemas) => {
    const mappedResources = {};

    Object.keys(resources).forEach((method) => {
        const add = {};
        const response = resources[method].responses.default;

        if (response) {
            let schema = null;
            let isArray = false;

            if (response.schema.items) {
                schema = response.schema.items.$ref;
                isArray = true;
            } else {
                schema = response.schema.$ref;
            }

            schema = maslowSchemas[schema.split('/').reverse()[0]];

            if (isArray) {
                add.transformResponse = (data) => data.map(schema);
            } else {
                add.transformResponse = schema;
            }

        }

        mappedResources[method] = {
            uri: '/',
            method,
            ...add
        };
    });

    return mappedResources;
};

const innerSet = (config, [path, ...paths], entity, value) => {
    const rentity = entity.replace(/{|}/g, '');

    if (!path) {
        return config[rentity] = value;
    }

    const rpath = path.replace(/{|}/g, '');

    if (paths.length === 0) {
        return config[rpath][rentity] = value;
    }

    return innerSet(config[rpath], paths, rentity, value);
};

export const parseOpenAPItoMaslowConfig = (openApiFile, maslowSchemas) => {
    const maslowConfig = {};

    Object.keys(openApiFile.paths).forEach((path) => {
        const [entity, ...paths] = path.replace(/^\//, '').split('/').reverse();

        innerSet(maslowConfig, paths.reverse(), entity, {
            uri: `/${entity}`,
            resources: mapResources(openApiFile.paths[path], maslowSchemas)
        });
    });

    return maslowConfig;
};