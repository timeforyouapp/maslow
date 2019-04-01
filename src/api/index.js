import { AxiosWrapper } from './axios';
import { MaslowClient } from './client';
import { MaslowSchema } from './schemas';
import { parseOpenAPItoMaslowConfig } from './openapi';

export const MaslowAPI = (baseUri, config, opts) => {
  const maslowSchemas = {};
  Object.keys(config.definitions).forEach((name) => {
    maslowSchemas[name] = MaslowSchema(config.definitions[name].properties, maslowSchemas);
  });

  Object.keys(maslowSchemas).forEach((name) => {
    maslowSchemas[name].setSchemas(maslowSchemas);
  });

  const parsedConfig = parseOpenAPItoMaslowConfig(config, maslowSchemas);
  const axios = AxiosWrapper({ baseUri, ...opts });

  return {
    _setPreFetch: axios.setPreFetch,
    _setPostFetch: axios.setPostFetch,
    schemas: maslowSchemas,
    ...MaslowClient(axios, parsedConfig),
  };
};

export default MaslowAPI;
