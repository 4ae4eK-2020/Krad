require('dotenv').config()

const fastify = require('fastify')({
  logger: true
})

//connect to DB
fastify.register(require('@fastify/postgres'), {
  connectionString: `postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.SERVICE}:${process.env.PORT}/${process.env.DB}`
})

//Add new User
fastify.post('/user/', function (req, reply) {
  let userData = req.body[0]

  //add data to DB
  fastify.pg.query(
    //validation

    `INSERT INTO public."Users" (name, email, phone, reg_day, is_activated)
    VALUES('${userData.name}'::"text", '${userData.email}'::"text", '${userData.phone}'::"text", '${userData.registration}'::date, '${userData.isActive}'::boolean)`,
    function onResult(err, result) {
      reply.send(err || result.rows)
    }
  )
})

//update user
fastify.post('/user/update', function (req, reply) {
  let userData = req.body[0]
  fastify.pg.query(
    `UPDATE public."Users" SET
    name = '${userData.name}'::text, email = '${userData.email}'::text, phone = '${userData.phone}'::text, is_activated = '${userData.isActive}'::boolean WHERE
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
      reply.send(err || result.rows)
    }
  )

})

//get data from DB
fastify.get('/user/', function (req, reply) {
  fastify.pg.query(
    'SELECT * FROM public."Users"',
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

