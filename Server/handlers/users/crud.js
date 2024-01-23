const { pool } = require('../../services/libs/pool')
const path = require('path')
const pdfMake = require('pdfmake')
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

async function createPdfDoc(obj) {
    let data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = "createPdfDoc"
    try {
        let fonts = {
            Times: {
                normal: path.join(__dirname, '..', '..', '/fonts/Times/Times-New-Roman.ttf'),
                bold: path.join(__dirname, '..', '..', '/fonts/Times/Times-New-Roman-Bold.ttf')
            }
        }
        pdfMake.setFonts(fonts);
        console.log(obj.query.fullName)

        const docId = obj.query.docId || 0
        const fullName = obj.query.fullName || ""
        const abbreviation = obj.query.abbreviation || ""
        const orgn = obj.query.orgn || 0
        const inn = obj.query.inn || 0
        const placeAdress = obj.query.placeAdress || ""
        const postAdress = obj.query.postAdress || 0
        const fio = obj.query.fio || ""
        const pasportNumbers = obj.query.pasportNumbers || 0
        const phone = obj.query.phone || 0
        const email = obj.query.email || ""

        let docData = {
            content: [
                {
                    text: `ЗАЯВЛЕНИЕ ЗАЕМЩИКА № ${docId}`,
                    style: 'header',
                    alignment: 'center',
                },
                {
                    text: 'о присоединении к Правилам инвестиционной платформы «Платформа № 1»\n\n',
                    alignment: 'center',
                },
                {
                    ol: [
                        [
                            {
                                text: '	Сведения о Заемщике:',
                                preserveLeadingSpaces: true
                            },
                            {
                                style: 'tableExample',
                                table: {
                                    body: [
                                        ['Полное наименование', fullName],
                                        ['Сокращенное наименование', abbreviation],
                                        ['ОГРН / ОГРНИП', orgn],
                                        ['ИНН', inn],
                                        [`Адрес юридического лица\n
                                    (из ЕГРЮЛ)/ Адрес места жительства (регистрации) или\n
                                    места пребывания для ИП`, placeAdress],
                                        ['Адрес почтовый', postAdress],
                                        ['ФИО руководителя', fio],
                                        ['Серия и номер паспорта', pasportNumbers],
                                        ['Телефон', phone],
                                        ['e-mail', email],
                                    ]
                                }
                            }],
                        {
                            text: `	Руководствуясь Федеральным законом от 02.08.2019 № 259-ФЗ "О привлечении инвестиций с использованием инвестиционных платформ и о внесении изменений в отдельные законодательные акты Российской Федерации", Гражданским кодексом РФ и Правилами инвестиционной платформы «Платформа № 1» (ООО «Платформа № 1», ИНН 9731055001, ОГРН 1197746646415) (далее - «Оператор»), Заемщик передает, а Оператор принимает настоящее Заявление о присоединении (далее - «Заявление о присоединении») к Правилам инвестиционной платформы «Платформа № 1» (далее - «Правила») в целях заключения договора об оказании услуг по привлечению инвестиций. Заемщик заключает указанный договор посредством присоединения к Правилам (ст. 428 Гражданского кодекса РФ).
                            \n`,
                            preserveLeadingSpaces: true,
                            alignment: 'stretch'
                        },
                        {
                            text: `	Настоящим Заемщик, в целях присоединения к Правилам, для дальнейшего исполнения взаимных обязательств в рамках заключаемых при помощи средств Платформы Договоров, а также в целях проверки и оценки платежеспособности/благонадежности и/или финансового положения и/или деловой репутации, проверки сведений, указанных в данном Заявлении, оценки риска сотрудничества, в течение срока действия договорных отношений, а также в течение последующих 5 (Пяти) лет с момента прекращения сотрудничества:
                            \n	Передает Оператору Персональные данные и выражает согласие на обработку с использованием средств автоматизации или без использования таких средств (включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение) своих персональных данных, включая, но не ограничиваясь, паспортные данные, ФИО, место жительства, дата рождения, номер мобильного/ городского, телефона, иные сведения, а также осуществление любых иных действий с предоставляемыми Персональными данными с учетом действующего законодательства.
                            \n	Выражает согласие на передачу Оператором своих Персональных данных, для достижения вышеуказанных целей, третьему лицу: в платежные системы, а также не кредитной, небанковской организации, а также их агентам и иным уполномоченным лицам, а также в случае возникновения задолженности у Заемщика, при привлечении Оператором/Инвестором третьих лиц к оказанию услуг Оператору/Инвестору и третьим лицам по взысканию такой задолженности с Заемщика (в том числе в случае уступки Инвестором/Оператором (ей) прав требования к Заемщику третьим лицом (или третьему лицу) или без уступки такого права) с предоставлением права таким третьим лицам на обработку передаваемых Персональных данных без получения дополнительного согласия.
                            \n	Подписывая настоящее Заявление о присоединении, Заемщик (единоличный исполнительный орган Заемщика) подтверждает, что является пользователем абонентского номера, указанного в разделе «Телефон» настоящего Заявления о присоединении, и дает согласие ПАО «ВымпелКом» (Публичное акционерное общество «Вымпел-Коммуникации», Российская Федерация, 127083, г. Москва, ул. Восьмого марта, дом 10, строение 14); ООО «М Дата» (115280 г. Москва, ул. Ленинская Слобода, д.19); ПАО МТС (109147, г. Москва, ул. Марксистская д.4); ООО «Т2 Мобайл» (108811, город Москва, километр Киевское шоссе 22-й (п Московский), домовладение 6 строение 1, этаж 5 комната 33); ПАО «Мегафон» (127006, г. Москва, пер. Оружейный, д.41) на обработку, в целях исполнения договорных обязательств, следующих данных: телефонный номер, информация об оказанных операторами услугах связи (в том числе информации о моем местонахождении при получении услуг связи) и платежах за эти услуги по договору об оказании услуг связи, идентификаторы пользовательского (оконечного) оборудования, и передачу ими результата обработки Оператору.
                            \n	Дает согласие Инвестору/Оператору на передачу третьему лицу, в случае уступки Инвестором/Оператором прав требования долга такому третьему лицу, а также при привлечении Инвестором/Оператором третьего лица к оказанию услуг Инвестору/Оператору по взысканию задолженности с Заемщика без уступки прав требования долга, сведений о неисполненных обязательствах Заемщика: сумме просроченной задолженности, размере начисленных на сумму задолженности, но не уплаченных, процентов, штрафов и неустоек.
                            \n`,
                            preserveLeadingSpaces: true
                        },
                        {
                            text: `	Дает согласие на получение Оператором от бюро кредитных историй (АО "НБКИ" ИНН 7703548386, АО "ОКБ" ИНН 7710561081, ООО "БКИ Эквифакс" ИНН 7813199667, а также иных Бюро кредитных историй), в том числе от их представителей, кредитного отчета с целью оценки благонадежности и/или финансового положения и /или деловой репутации из основной части кредитной истории Заемщика и уполномоченного лица Заемщика, подписывающего настоящее Заявление о присоединении.
                            \n	Заемщик осведомлен, что срок действия предоставленных в настоящем Заявлении о присоединении согласий на получение Оператором кредитного отчета по кредитной истории Заемщика и представителя Заемщика, подписывающего настоящее Заявление о присоединении, в соответствии с Законом № 218-ФЗ, составляет 6 (шесть) календарных месяцев с даты его предоставления и согласен, что в случае, если в течение указанного срока с субъектом кредитной истории будет заключен договор займа, указанное согласие субъекта кредитной истории сохраняет силу в течение всего срока действия такого договора.
                            \n`,
                            preserveLeadingSpaces: true
                        },
                        {
                            text: `	Подписывая настоящее Заявление, Заемщик подтверждает, что все сделки, заключаемые в рамках Правил, совершаются в простой письменной форме и подписываются простой электронной подписью Заемщика в порядке, установленном соответствующим разделом Правил.
                            \n	Соглашение об использовании указанного аналога собственноручной подписи считается достигнутым в момент передачи настоящего заявления Оператору.
                            \n	Заемщик настоящим подтверждает, что любой документ, подписанный простой электронной подписью в порядке, установленном Правилами, и размещенный Заемщиком на платформе «Платформа № 1» имеет юридическую силу документа, подписанного собственноручно, и соответственно, порождает идентичные такому документу юридические последствия.
                            \n	Заемщик оповещен и согласен соблюдать конфиденциальность ключа электронной подписи и правилами определения лица, подписывающего электронный документ.
                            \n`,
                            preserveLeadingSpaces: true
                        },
                        {
                            text: `	Настоящее Заявление о присоединении к Правилам подписано квалифицированной электронной цифровой подписью, и такое заявление в силу ст. 6 Федерального закона от 06.04.2011 № 63-ФЗ (ред. от 23.06.2016) "Об электронной подписи" приравнивается к документу, подписанному собственноручной подписью, и может применяться в любых правоотношениях в соответствии с законодательством Российской Федерации без ограничений.
                            \n`,
                            preserveLeadingSpaces: true
                        }
                    ]
                },
                {
                    text: `	ЗАЕМЩИК ПОДПИСАНО ЭЦП 							Дата создания документа: _______________`,
                    bold: true,
                    alignment: 'stretch',
                    preserveLeadingSpaces: true
                }
            ],
            styles: {
                header: {
                    fontSize: 12,
                    bold: false,
                    margin: [0, 5, 0, 10],
                    font: 'Times'
                },
                tableExample: {
                    margin: [0, 5, 0, 15],
                    font: 'Times'
                },
                tableHeader: {
                    bold: false,
                    fontSize: 12,
                    color: 'black',
                    font: 'Times'
                }
            },
            defaultStyle: {
                fontSize: 12,
                margin: [0, 5, 0, 0],
                font: 'Times'
              }
        }
        
        pdfMake.createPdf(docData).write('doc.pdf')
        data.message = fs.readFileSync('doc.pdf')
        data.statusCode = 200

    } catch (error) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(error.message, error.stack);
        data.statusCode = 500
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
    createPdfDoc: createPdfDoc,
}