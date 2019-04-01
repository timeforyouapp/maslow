// --------------
// Mocks
// --------------
import { AxiosWrapper } from '../../src/api/axios';
import { MaslowClient } from '../../src/api/client';
import { MaslowSchema } from '../../src/api/schemas';
import { parseOpenAPItoMaslowConfig } from '../../src/api/openapi';

// --------------
// Test It!
// --------------
import { MaslowAPI } from '../../src/api/index';

import {
  openApiPaths as paths,
} from '../helpers/mocks';

jest.mock('../../src/api/axios');
jest.mock('../../src/api/client');
jest.mock('../../src/api/schemas');
jest.mock('../../src/api/openapi');

describe('MaslowAPI', () => {
  const fakeUrl = 'http://something.foo';
  const schema = 'foo';
  const parsedConfig = 'bar';
  const definitions = { User: schema };

  const clientResp = {
    user: {
      get: 'foobar',
      post: 'fizzfuzz',
    },
  };

  const fakeAxios = {
    setPreFetch: 'fizz',
    setPostFetch: 'fuzz',
  };

  beforeEach(() => {
    MaslowSchema.mockReturnValue(schema);
    parseOpenAPItoMaslowConfig.mockReturnValue(parsedConfig);
    AxiosWrapper.mockReturnValue(fakeAxios);
    MaslowClient.mockReturnValue(clientResp);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('testing something', () => {
    const api = MaslowAPI(fakeUrl, { paths, definitions });

    expect(api).toHaveProperty('_setPreFetch', fakeAxios.setPreFetch);
    expect(api).toHaveProperty('_setPostFetch', fakeAxios.setPostFetch);
    expect(api).toHaveProperty('user');
    expect(api).toHaveProperty('schemas');
    expect(api.schemas).toHaveProperty('User', schema);
    expect(api.user).toHaveProperty('get', clientResp.user.get);
    expect(api.user).toHaveProperty('post', clientResp.user.post);
  });
});
