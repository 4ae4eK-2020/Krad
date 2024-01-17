require('dotenv').config()
const cors = require('@fastify/cors')
const { json } = require('body-parser')

const fastify = require('fastify')({
  logger: true
})

fastify.register(cors, {

})

//connect to DB
fastify.register(require('@fastify/postgres'), {
  connectionString: `postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.SERVICE}:${process.env.PORT}/${process.env.DB}`
})

//Add new User
fastify.post('/user/new/', function (req, reply) {
  let userData = req.body

  //add data to DB
  fastify.pg.query(
    `INSERT INTO public."Users" (name, email, phone, reg_day, is_activated)
    VALUES('${userData.name}'::"text", '${userData.email}'::"text", '${userData.phone}'::"text", '${userData.registration}'::date, '${userData.isactive}'::boolean)`,
    function onResult(err, result) {
      req.body.id +=1
      reply.send(err || req.body)
    }
  )
})

//update user
fastify.post('/user/update', function (req, reply) {
  console.log(req.body)
  let userData = req.body
  fastify.pg.query(
    `UPDATE public."Users" SET
    name = '${userData.name}'::text, email = '${userData.email}'::text, phone = '${userData.phone}'::text, is_activated = '${userData.isactive}'::boolean WHERE
    id = '${userData.id}';`,
    function onResult(err, result) {
      reply.send(err || result.rows)
    }
  )
})

//delete user
fastify.post('/user/delete', function (req, reply) {
  let userData = req.body[0].id
  fastify.pg.query(
    `DELETE FROM public."Users"
    WHERE id IN
        (${userData});`,
    function onResult(err, result) {
      reply.send(err || {
        result: "Done"
      })
    }
  )

})

//get data from DB
fastify.get('/user/', function (req, reply) {
  fastify.pg.query(
    'SELECT id, name, email, phone, reg_day AS registration, is_activated AS isactive FROM public."Users" ORDER BY id',
    function onResult(err, result) {
      reply.send(err || result.rows)
    }
  )
})

//start server
const start = async () => {
  try {
    await fastify.listen({ port: 5501 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

function valudationUser(_user) {

}

