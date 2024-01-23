const { createUser, readUser, updateUser, deleteUser, filterUser, addDescriptionUser, getDescriptionUser, createPdfDoc } = require('../../handlers/users/crud')

module.exports = function (fastify, opts, next) {
    //create
    fastify.route({
        url: '/create',
        method: "PUT",
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer'
                    },
                    name: {
                        type: 'string'
                    },
                    email: {
                        type: 'string'
                    },
                    phone: {
                        type: 'string'
                    },
                    registration: {
                        type: 'string'
                    },
                    isactive: {
                        type: 'boolean'
                    }
                },
                required: ['id']
            }
        },
        async handler(request, reply) {
            const data = await createUser(request.body)
            reply.status(data.statusCode)
            reply.send(data)
        }
    })
    //get
    fastify.route({
        url: '/create',
        method: "GET",
        schema: {
            id: {
                type: 'integer'
            },
            name: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            phone: {
                type: 'string'
            },
            registration: {
                type: 'string'
            },
            isactive: {
                type: 'boolean'
            }
        },
        async handler(request, reply) {
            const data = await readUser(request.body)
            reply.status(data.statusCode)
            reply.send(data)
        }
    })
    //update
    fastify.route({
        url: '/create',
        method: "POST",
        schema: {
            id: {
                type: 'integer'
            },
            name: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            phone: {
                type: 'string'
            },
            registration: {
                type: 'string'
            },
            isactive: {
                type: 'boolean'
            }
        },
        async handler(request, reply) {
            const data = await updateUser(request.body)
            reply.status(data.statusCode)
            reply.send(data)
        }
    })
    //delete
    fastify.route({
        url: '/create',
        method: "DELETE",
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer'
                    },
                    name: {
                        type: 'string'
                    },
                    email: {
                        type: 'string'
                    },
                    phone: {
                        type: 'string'
                    },
                    registration: {
                        type: 'string'
                    },
                    isactive: {
                        type: 'boolean'
                    }
                },
                required: ['id']
            }
        },
        async handler(request, reply) {
            let data = await deleteUser(request.body)
            reply.send(data)
        }
    })

    //filter
    fastify.route({
        url: '/create/filter',
        method: "POST",
        schema: {
            type: {
                type: "string"
            },
            value: {
                type: "string"
            }
        },
        async handler(request, reply) {
            const data = await filterUser(request.body)
            reply.status(data.statusCode)
            reply.send(data)
        }
    })

    //add description
    fastify.route({
        url: '/create/description',
        method: "POST",
        schema: {
            body: {
                id: {
                    type: "integer"
                },
                value: {
                    type: "string"
                }
            }
        },
        async handler(request, reply) {
            const data = await addDescriptionUser(request.body)
            reply.status(data.statusCode)
            reply.send(data)
        }
    })

    //get description
    fastify.route({
        url: '/create/description',
        method: "PUT",
        schema: {
            body: {
                id: {
                    type: "integer"
                },
                value: {
                    type: "string"
                }
            }
        },
        async handler(request, reply) {
            console.log(request.params)
            const data = await getDescriptionUser(request.body)
            reply.status(data.statusCode)
            reply.send(data)
        }
    })


    //create pdf
    fastify.route({
        url: '/create/pdf',
        method: "GET",
        schema: {
            querystring: {
                docId: {
                    type : 'integer'
                },
                fullName: {
                    type: 'string'
                },
                abbreviation: {
                    type: 'string'
                },
                orgn: {
                    type: 'integer'
                },
                inn: {
                    type: 'integer'
                },
                placeAdress: {
                    type: 'string'
                },
                postAdress: {
                    type: 'integer'
                },
                fio: {
                    type: 'string'
                },
                pasportNumbers: {
                    type: 'integer'
                },
                phone: {
                    type: 'string'
                },
                email: {
                    type: 'string'
                }
            }
        },
        async handler(request, reply) {
            const data = await createPdfDoc(request)
            reply.header('Content-Type', 'application/pdf')
            reply.status(data.statusCode)
            reply.send(data.message)
        }
    })

    next()
}