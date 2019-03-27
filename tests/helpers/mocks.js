export const FAKE_DOMAIN_TYPE = {
    success: 'success',
    fetching: 'fetching',
    error: 'error',
};

export const FAKE_TYPES = {
    setAll: 'setAll',
    set: 'set',
    clearState: 'clearState',
    getDetail: FAKE_DOMAIN_TYPE,
    getList: FAKE_DOMAIN_TYPE,
    save: FAKE_DOMAIN_TYPE,
    remove: FAKE_DOMAIN_TYPE,
    domainFetching: 'domainFetching',
    domainFetchSuccess: () => 'domainFetchSuccess',
    domainFetchError: 'domainFetchError',
};

export const FAKE_API = (j) => ({
    getDetail: j.fn(),
    getList: j.fn(),
    update: j.fn(),
    create: j.fn(),
    remove: j.fn(),
})

export const openApiPaths = {
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

export const openApiDefinitions = {
    "properties": {
        "created_at": {
            "format": "date-time",
            "readOnly": true,
            "type": "string",
            "x-nullable": true
        },
        "email": {
            "maxLength": 200,
            "type": "string"
        },
        "id": {
            "maxLength": 36,
            "readOnly": true,
            "type": "string"
        },
        "name": {
            "maxLength": 200,
            "type": "string"
        },
        "password": {
            "maxLength": 256,
            "type": "string"
        },
        "notMaxLength": {
            "type": "string"
        }
    },
    "required": [
        "email",
        "name",
        "password"
    ],
    "type": "object"
}