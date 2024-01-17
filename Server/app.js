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
fastify.post('/user/new', function (req, reply) {
  let userData = req.body
  try {
    //add data to DB
    fastify.pg.query(
      `INSERT INTO public."Users" (name, email, phone, reg_day, is_activated)
    VALUES($1::"text", $2::"text", $3::"text", $4::date, $5::boolean)`, [userData.name, userData.email, userData.phone, userData.registration, userData.isactive],
      function onResult(err, result) {
        console.log(result.rows)
        reply.send(result.rows)
      }
    )
  } catch (err) {
    console.log(err)
  }

})

//update user
fastify.post('/user/update', function (req, reply) {
  console.log(req.body)
  let userData = req.body
  try {
    fastify.pg.query(
      `UPDATE public."Users" SET
    name = $1::text, email = $2::text, phone = $3::text, is_activated = $4::boolean WHERE
    id = $5;`, [userData.name, userData.email, userData.phone, userData.isactive, userData.id],
      function onResult(err, result) {
        reply.send(err || result.rows)
      }
    )
  } catch (error) {
    console.log(error)
  }
})

//delete user
fastify.post('/user/delete', function (req, reply) {
  let userData = req.body.id
  try {
    fastify.pg.query(
      `DELETE FROM public."Users"
    WHERE id =$1;`, [userData.id],
      function onResult(err) {
        reply.send(err || {
          result: "Done"
        })
      }
    )
  } catch (error) {
    console.log(error)
  }
})

//get data from DB
fastify.get('/user/', function (req, reply) {
  try {
    fastify.pg.query(
      'SELECT id, name, email, phone, reg_day AS registration, is_activated AS isactive FROM public."Users" ORDER BY id',
      function onResult(err, result) {
        reply.send(err || result.rows)
      }
    )
  } catch (error) {
    console.log(error)
  }
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

