import { parseOpenAPItoMaslowConfig } from '../../src/openapi/config';

describe('config parser', () => {
    const paths = {
        "/user": {
            "get": {
                "description": "User CRUD",
                "parameters": [],
                "responses": {
                    "default": {
                        "description": "",
                        "schema": {
                            "items": {
                                "$ref": "#/definitions/User"
                            },
                            "type": "array"
                        }
                    }
                },
                "tags": [
                    "user"
                ]
            },
            "options": {
                "description": "User CRUD",
                "parameters": [],
                "responses": {
                    "default": {
                        "description": "",
                        "schema": {
                            "items": {
                                "$ref": "#/definitions/User"
                            },
                            "type": "array"
                        }
                    }
                },
                "tags": [
                    "user"
                ]
            },
            "post": {
                "description": "User CRUD",
                "parameters": [],
                "responses": {
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                },
                "tags": ["user"]
            }
        },
        "/user/{id}": {
            "get": {
                "description": "User CRUD",
                "parameters": [
                    {
                    "in": "path",
                    "name": "id",
                    "required": true,
                    "type": "string"
                    }
                ],
                "responses": {
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                },
                "tags": [
                    "user"
                ]
            },
            "options": {
                "description": "User CRUD",
                "parameters": [
                    {
                    "in": "path",
                    "name": "id",
                    "required": true,
                    "type": "string"
                    }
                ],
                "responses": {
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                },
                "tags": [
                    "user"
                ]
            }
        },
        "/user/{id}/foo": {
            "get": {
                "description": "User CRUD",
                "parameters": [
                    {
                        "in": "path",
                        "name": "id",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {},
            },
        }
    }

    const expectResource = (resource, method, uri) => {
        expect(resource).toHaveProperty('method', method);
        expect(resource).toHaveProperty('uri', uri);
    }

    it('test parser', () => {
        const maslowFakeSchemas = { User: jest.fn() }
        const maslowConfig = parseOpenAPItoMaslowConfig({ paths }, maslowFakeSchemas);

        expect(maslowConfig).toHaveProperty('user');

        expect(maslowConfig.user).toHaveProperty('uri', '/user');
        expect(maslowConfig.user).toHaveProperty('resources');
        Object.keys(maslowConfig.user.resources).forEach((method) => {
            expectResource(maslowConfig.user.resources[method], method, '/');
        });

        expect(maslowConfig.user).toHaveProperty('id');
        expect(maslowConfig.user.id).toHaveProperty('uri', '/{id}');
        expect(maslowConfig.user.id).toHaveProperty('resources');
        Object.keys(maslowConfig.user.id.resources).forEach((method) => {
            expectResource(maslowConfig.user.resources[method], method, '/');
        });

        expect(maslowConfig.user.id).toHaveProperty('foo');
        expect(maslowConfig.user.id.foo).toHaveProperty('uri', '/foo');
        expect(maslowConfig.user.id.foo).toHaveProperty('resources');
        Object.keys(maslowConfig.user.id.foo.resources).forEach((method) => {
            expectResource(maslowConfig.user.resources[method], method, '/');
        });


        const fakeEntry = 1;
        maslowConfig.user.resources.get.transformResponse([fakeEntry]);
        maslowConfig.user.resources.post.transformResponse(fakeEntry);

        expect(maslowFakeSchemas.User).toHaveBeenCalledWith(fakeEntry);
        expect(maslowFakeSchemas.User).toHaveBeenCalledWith(fakeEntry);
        expect(maslowFakeSchemas.User).toHaveBeenCalledTimes(2);
    });
});
