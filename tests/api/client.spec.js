import { MaslowClient } from '../../src/api/client';

describe('MaslowClient', () => {
  const fakeTransformResponseValue = 'fizzbuzz';
  const fakeTransformResponse = jest.fn().mockReturnValue(fakeTransformResponseValue);
  const fakeMaslowConfig = {
    user: {
      uri: '/user',
      resources: {
        get: { uri: '/', method: 'get', transformResponse: fakeTransformResponse },
      },
      id: {
        uri: '/{id}',
        resources: {
          post: { uri: '/', method: 'post' },
        },
      },
      foo: {
        uri: '/foo',
        resources: {
          delete: { uri: '/', method: 'delete' },
        },
      },
    },
  };

  it('should init client correctly and request a get', () => {
    const fakeReturn = 'bar';
    const fakeApi = { get: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)) };
    const client = MaslowClient(fakeApi, fakeMaslowConfig);

    expect(client).toHaveProperty('user');
    return client.user.get().then((value) => {
      expect(fakeApi.get).toHaveBeenCalledWith('/user/');
      expect(value).toBe(fakeTransformResponseValue);
    });
  });

  it('should init client correctly and request a get', () => {
    const fakeId = 1;
    const fakeEntry = 'foo';
    const fakeReturn = 'bar';
    const fakeApi = { post: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)) };
    const client = MaslowClient(fakeApi, fakeMaslowConfig);

    expect(client).toHaveProperty('user');
    return client.user.id(fakeId).post(fakeEntry).then((value) => {
      expect(fakeApi.post).toHaveBeenCalledWith(`/user/${fakeId}/`, fakeEntry);
      expect(value).toBe(fakeReturn);
    });
  });

  it('should map inner path correctly', () => {
    const fakeReturn = 'bar';
    const fakeApi = { delete: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)) };
    const client = MaslowClient(fakeApi, fakeMaslowConfig);

    expect(client).toHaveProperty('user');
    return client.user.foo.delete().then((value) => {
      expect(fakeApi.delete).toHaveBeenCalledWith('/user/foo/');
      expect(value).toBe(fakeReturn);
    });
  });
});
