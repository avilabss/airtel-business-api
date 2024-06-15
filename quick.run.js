import dotenv from 'dotenv'
dotenv.config()

import { Client, logger } from './lib/index.js'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { ConnectionType, Lob } from './lib/enums/connection.js'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD
const SESSION_FILE = './session.json'

const client = new Client()

try {
    if (existsSync(SESSION_FILE)) {
        const session = JSON.parse(readFileSync(SESSION_FILE))
        client.importSession(session)
    } else {
        await client.authenticate.usingPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
        const session = client.exportSession()
        writeFileSync('./session.json', JSON.stringify(session))
    }

    logger.info('Session loaded')

    await client.authenticate.refreshToken()
    logger.info('Token refreshed')

    await client.authenticate.checkSession()
    logger.info('Session checked')

    const connections = await client.connection.getList({
        lob: Lob.MOBILITY,
        connectionType: ConnectionType.MOBILE,
        limit: 1,
        offset: 0,
    })
    logger.info(`Found connections: ${JSON.stringify(connections)}`)
} catch (error) {
    if (client.connection.lastResponse) {
        writeFileSync('./error.json', client.connection.lastResponse.body)
    }
    throw error
}
