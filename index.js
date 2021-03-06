'use strict'

const Hapi = require('hapi')
const boom = require('boom')
const uuid = require('node-uuid')
const config = require('./config')

const server = new Hapi.Server({
    cache: {
        engine: require('catbox-redis'),
        name: 'catch-all',
        database: 'hapi-everything',
        shared: true
    }
})

server.connection({
	host: 'localhost',
	port: 3838,
	routes: {
		cors: true
	}
})

server.ext('onRequest', function (request, reply) {
	request.app.requestStartTime = Date.now()
	reply.continue()
})

server.ext('onPreResponse', (request, reply) => {
	const responseTime = Math.ceil(Date.now() - request.app.requestStartTime)
	if (request.response.header) { // This is not always available due to errors
		request.response.header('x-response-time', responseTime)
	}
	reply.continue()
})

const goodOptions = {
	reporters: [
		{
			reporter: require('good-console'),
			events: {
				log: '*',
				response: '*'
			}
		},
		{
			reporter: require('good-loggly'),
			events: {
				log: '*',
				response: '*'
			},
			config: {
				token: config.loggly.token,
				subdomain: config.loggly.subdomain,
				name: 'hapi-everything',
				tags: ['api']
			}
		}
	]
}
const mongoDbOptions = { url: 'mongodb://localhost:27017/everything' }
const swaggerOptions = { info: { 'title': 'Hapi Everything API Documentation' }, documentationPath: '/', sortEndpoints: 'path' }

server.register(
	[
		{ register: require('inert') }, // Serve static files
		{ register: require('vision') }, // Template rendering
		{ register: require('hapi-swagger'), options: swaggerOptions }, // Route documentation
		{ register: require('blipp') }, // Display route table on start
		{ register: require('hapi-mongodb'), options: mongoDbOptions }, // MongoDB connection sharing
		{ register: require('good'), options: goodOptions }, // Server monitoring
		{ register: require('tv') }, // Request debugging
		{ register: require('./plugins/users') }, // User CRUD
		{ register: require('./plugins/groups') } // Group CRUD
	],
	err => {
		if (err) {
			console.log('Failed to register one or more plugins')
			throw err
		}
		server.start(err => {
			if (err) {
				console.log('Failed to start the server')
				throw err
			}
			console.log('Server running at:', server.info.uri)
		})
	}
)

server.method('helpers', require('./plugins/helpers'));

// TEMP: This whole route can go once the CRUD for users is in place, for now though:
server.route([
	{
		method: 'get',
		path: '/load',
		config: {
			handler: (request, reply) => {
				return reply(boom.notImplemented())
				const col = request.server.plugins['hapi-mongodb'].db.collection('users')
				const users = require('./users.json')
				col.insertMany(users.map(user => {
					return {
						_id: uuid.v4(),
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email
					}
				}), (err, results) => {
					if (err) {
						return reply(err)
					}
					reply().code(201)
				})
			}
		}
	}
])
