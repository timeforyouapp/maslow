jest.mock('axios');

import axios from 'axios';
import { AxiosWrapper } from '../../src/api/axios';

describe('AxiosWrapper', () => {
    let fakeServer;
    const fakeReturn = 'foo';
    const p1 = 'fuzz'
    const p2 = 'fizz'

    beforeEach(() => {
        fakeServer = {
            __meta__ : {}
        }

        fakeServer.get = jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
        fakeServer.post = jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
        fakeServer.delete = jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
        fakeServer.put = jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),

        axios.create.mockReturnValue(fakeServer)
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should start wrapper and execute get', () => {
        const fakeUrl = 'bar';
        const client = AxiosWrapper({ baseUri: fakeUrl });

        return client.get(p1, p2).then((response) => {
            expect(fakeServer.get).toHaveBeenCalledWith(p1, p2);
            expect(response).toBe(fakeReturn);
        });
    });

    it('should start wrapper and execute post with fn preFetch', () => {
        const fakeUrl = 'bar';
        const test = 'foobar';
        const client = AxiosWrapper({ baseUri: fakeUrl, preFetch: (axiosClient) => {
            axiosClient.__meta__.test = test;
        }});

        return client.post(p1, p2).then((response) => {
            expect(client.__axios__).toHaveProperty('__meta__', {test});
            expect(fakeServer.post).toHaveBeenCalledWith(p1, p2);
            expect(response).toBe(fakeReturn);
        });
    });

    it('should start wrapper and execute put with promise preFetch that change method to delete', () => {
        const fakeUrl = 'bar';
        const test = 'delete';
        const client = AxiosWrapper({
            baseUri: fakeUrl,
            preFetch: async (axiosClient) => ({
                method: axiosClient.__meta__.test
            })
        });

        client.__axios__.__meta__.test = test

        return client.put(p1, p2).then((response) => {
            expect(client.__axios__).toHaveProperty('__meta__', {test});
            expect(fakeServer.delete).toHaveBeenCalledWith(p1, p2);
            expect(response).toBe(fakeReturn);
        });
    });

    it('should start wrapper and delete with postFetch', () => {
        const fakeUrl = 'bar';
        const test = 'delete';
        const client = AxiosWrapper({
            baseUri: fakeUrl,
            postFetch: async () => {
                return test
            }
        });

        return client.delete(p1).then((response) => {
            expect(fakeServer.delete).toHaveBeenCalledWith(p1, undefined);
            expect(response).toBe(test);
        });
    });
});