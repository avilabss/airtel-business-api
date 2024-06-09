import dotenv from 'dotenv'
dotenv.config()

import { Client } from './lib/index.js'
import { writeFileSync } from 'fs'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD

const client = new Client()

try {
    await client.authenticate.usingPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
    const session = client.exportSession()
    console.log(JSON.stringify(session))
} catch (error) {
    if (client.connection.lastResponse) {
        writeFileSync('./error.json', client.connection.lastResponse.body)
    }
    throw error
}
