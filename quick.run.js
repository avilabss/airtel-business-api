import dotenv from 'dotenv'
dotenv.config()

import { Client, Connection } from './lib/index.js'
import { writeFileSync } from 'fs'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD

// const connection = new Connection({
//     proxyUrl: 'http://localhost:8000',
// })
// const client = new Client(connection)

const client = new Client()

try {
    const result = await client.authenticate.usingPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
    console.log(JSON.stringify(result))

    const session = client.exportSession()
    console.log(JSON.stringify(session))
} catch (error) {
    if (client.connection.lastResponse) {
        writeFileSync('./error.json', client.connection.lastResponse.body)
    }
    throw error
}
