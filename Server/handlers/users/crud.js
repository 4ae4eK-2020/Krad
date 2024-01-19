const { pool } = require('../../services/libs/pool')
const fs = require('fs')

async function createUser(object) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "createUser"
    const client = await pool.connect()

    try {
        const user = await client.query(
            `INSERT INTO public."Users" (name, email, phone, reg_day, is_activated)
          VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [
                object.name,
                object.email,
                object.phone,
                object.registration,
                object.isactive
            ],
        )

        console.log(user.rows)
        data.statusCode = 200
        data.message = user.rows
    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}

async function readUser(object) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "getUser"
    const client = await pool.connect()

    try {
        const user = await client.query(
            'SELECT id, name, email, phone, reg_day AS registration, is_activated AS isactive FROM public."Users" ORDER BY id'
        )

        console.log(user)
        data.message = user.rows
        data.statusCode = 200
    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
        data.statusCode = 500
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}

async function updateUser(object) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "updateUser"
    const client = await pool.connect()

    try {
        const haveRow = await client.query(
            `SELECT * FROM public."Users" WHERE id=$1`, [object.id]
        )

        if (haveRow.rowCount == 0) {
            data.message = "Not found"
            data.statusCode = 404
        } else {
            const user = await client.query(
                `UPDATE public."Users" SET
    name = $1, email = $2, phone = $3, is_activated = $4 WHERE
    id = $5 RETURNING *`,
                [
                    object.name,
                    object.email,
                    object.phone,
                    object.isactive,
                    object.id
                ]
            )
            console.log(user)
            data.message = user.rows
            data.statusCode = 200
        }
    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
        data.statusCode = 500
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}

async function deleteUser(object) {
    let data = {
        message: 'error',
        statusCode: 400
    };

    const funcName = "deleteUser"
    const client = await pool.connect()

    try {
        const haveRow = await client.query(
            `SELECT * FROM public."Users" WHERE id=$1`, [object.id]
        )

        if (haveRow.rowCount == 0) {
            data.message = "Not found"
            data.statusCode = 404
        } else {
            const user = await client.query(
                `DELETE FROM public."Users"
        WHERE id=$1`, [object.id]
            )

            console.log(user)
            data.message = "Done"
            data.statusCode = 200
        }
    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}

async function filterUser(object) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "updateUser"
    const client = await pool.connect()

    try {
        let user
        let sqlString = `SELECT id, name, email, phone, reg_day AS registration, is_activated AS isactive FROM public."Users" WHERE`

        for (let index = 0; index < object.type.length; index++) {
            switch (object.type[index]) {
                case 'id':
                    sqlString += ` id=$${index + 1} AND`
                    break;
                case 'name':
                    sqlString += ` name=$${index + 1} AND`
                    break;
                case 'email':
                    sqlString += ` email=$${index + 1} AND`
                    break;
                case 'phone':
                    sqlString += ` phone=$${index + 1} AND`
                    break;
                case 'reg_day':
                    sqlString += ` reg_day=$${index + 1} AND`
                    break;
                case 'is_activated':
                    sqlString += ` is_activated=$${index + 1} AND`
                    break;
                default:
                    data.message = "No valid type"
                    break;
            }
        }
        console.log(sqlString, ...object.value)
        user = await client.query(
            sqlString.slice(0, -4) + ` ORDER BY id`, object.value
        )


        console.log(object.type, object.value, user)
        if (user.rowCount == 0) {
            data.message = "user not found"
            return data
        }

        data.message = user.rows
        data.statusCode = 200
    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
        data.statusCode = 500
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}

async function addDescriptionUser(object) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "addDescriptionUser"
    const client = await pool.connect()


    let fileName = "description_"

    try {
        const descriptionPath = await client.query(
            `SELECT description FROM public."Users" WHERE id=$1`, [object.id]
        )
        const path = descriptionPath.rows[0].description || "./data/" + fileName
        let description = object.value

        await fs.writeFile(path + ".txt", description, "utf-8", () => { })
        
        const user = await client.query(
            `UPDATE public."Users" SET
            description=$1`, [path])

        data.message = `Write compliete`
        data.statusCode = 200

    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
        data.statusCode = 500
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}

async function getDescriptionUser(object) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "getDescriptionUser"
    const client = await pool.connect()


    let fileName = "description_"

    try {
        const descriptionPath = await client.query(
            `SELECT description FROM public."Users" WHERE id=$1`, [object.id]
        )
        const path = descriptionPath.rows[0].description || "./data/" + fileName

        data.message = await fs.readFileSync(path + ".txt", "utf-8")
        data.statusCode = 200

    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
        data.statusCode = 500
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}


module.exports = {
    createUser: createUser,
    readUser: readUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    filterUser: filterUser,
    addDescriptionUser: addDescriptionUser,
    getDescriptionUser: getDescriptionUser,
}