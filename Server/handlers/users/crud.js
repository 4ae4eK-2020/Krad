const { pool } = require('../../services/libs/pool')
const fs = require('fs')

async function createUser(obj) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "createUser"
    const client = await pool.connect()

    try {
        const user = await client.query(
            `INSERT INTO public."Users" (name, email, phone, reg_day, is_activated)
          VALUES($1, $2, $3, $4, $5) RETURNING id`,
            [
                obj.name,
                obj.email,
                obj.phone,
                obj.registration,
                obj.isactive
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

async function readUser(obj) {
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

async function updateUser(obj) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "updateUser"
    const client = await pool.connect()

    try {
        const haveRow = await client.query(
            `SELECT * FROM public."Users" WHERE id=$1`, [obj.id]
        )
            console.log(haveRow.rows)
        if (haveRow.rows.length == 0) {
            data.message = "Not found"
            data.statusCode = 404
            return data
        } else {
            const user = await client.query(
                `UPDATE public."Users" SET
    name = $1, email = $2, phone = $3, is_activated = $4 WHERE
    id = $5 RETURNING id`,
                [
                    obj.name,
                    obj.email,
                    obj.phone,
                    obj.isactive,
                    obj.id
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

async function deleteUser(obj) {
    let data = {
        message: 'error',
        statusCode: 400
    };

    const funcName = "deleteUser"
    const client = await pool.connect()

    try {
        const haveRow = await client.query(
            `SELECT * FROM public."Users" WHERE id=$1`, [obj.id]
        )

        if (haveRow.rows == []) {
            data.message = "Not found"
            data.statusCode = 404
        } else {
            const user = await client.query(
                `DELETE FROM public."Users"
        WHERE id=$1`, [obj.id]
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

async function filterUser(obj) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "updateUser"
    const client = await pool.connect()

    try {
        let user
        let sqlString = `SELECT id, name, email, phone, reg_day AS registration, is_activated AS isactive FROM public."Users" WHERE`

        for (let index = 0; index < obj.type.length; index++) {
            switch (obj.type[index]) {
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
        console.log(sqlString, ...obj.value)
        user = await client.query(
            sqlString.slice(0, -4) + ` ORDER BY id`, obj.value
        )


        console.log(obj.type, obj.value, user)
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

async function addDescriptionUser(obj) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "addDescriptionUser"
    const client = await pool.connect()


    let fileName = "description_"

    try {
        console.log(obj.id)
        const descriptionPath = await client.query(
            `SELECT description FROM public."Users" WHERE id=$1`, [obj.id]
        )
        console.log(obj.value)
        const path = descriptionPath.rows[0].description || "./data/" + fileName + obj.id
        let description = obj.value

        await fs.writeFile(path + ".txt", description, "utf-8", () => { })
        
        const user = await client.query(
            `UPDATE public."Users" SET
            description=$1
            WHERE id=$2`, [path, obj.id])
        console.log(user)
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

async function getDescriptionUser(obj) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "getDescriptionUser"
    const client = await pool.connect()


    let fileName = "description_"

    try {
        const descriptionPath = await client.query(
            `SELECT description FROM public."Users" WHERE id=$1`, [obj.id]
        )
        const path = descriptionPath.rows[0].description || "./data/" + fileName + obj.id

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