import { AxiosWrapper } from './axios';
import { MaslowClient } from './client';
import { MaslowSchema } from './schemas';
import { parseOpenAPItoMaslowConfig } from './openapi';

export const MaslowAPI = (baseUri, config, opts) => {
    const maslowSchemas = {};
    Object.keys(config.definitions).forEach((name) => {
        maslowSchemas[name] = MaslowSchema(config.definitions[name]);
    });

    const parsedConfig = parseOpenAPItoMaslowConfig(config, maslowSchemas);
    const _axios = AxiosWrapper({ baseUri, ...opts });

    return {
        _setPreFetch: _axios.setPreFetch,
        _setPostFetch: _axios.setPostFetch,
        _schemas: maslowSchemas,
        ...MaslowClient(_axios, parsedConfig),
    }
}

export default MaslowAPI;