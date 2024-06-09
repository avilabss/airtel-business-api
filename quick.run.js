import dotenv from 'dotenv'
dotenv.config()

import { Client } from './lib/index.js'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD

const client = new Client()
const result = await client.authenticate.usingPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
console.log(JSON.stringify(result))

const session = client.exportSession()
console.log(JSON.stringify(session))
