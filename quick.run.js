import { Connection, logger } from './lib/index.js'

const connection = new Connection({
    prefixUrl: 'https://ifconfig.me',
})

const response = await connection.get('ip')
logger.info(response.body)
