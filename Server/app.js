require('dotenv').config()

const cors = require('@fastify/cors')
const autoload = require('@fastify/autoload')
const path = require('path')
const fastify = require('fastify')({
  logger: true
})

fastify.register(cors, {

})

fastify.register(autoload, {
  dir: path.join(__dirname, './routes')
})

console.log(path.join(__dirname, './routes'))

//start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT, host: process.env.HOST })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

