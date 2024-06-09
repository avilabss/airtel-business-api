export * from './types/authenticate.js'

export * from './exceptions/baseError.js'

export * from './utils/connection.js'
export * from './utils/crypto.js'
export * from './utils/logger.js'

import { Connection } from './utils/connection.js'
import { logger } from './utils/logger.js'

const connection = new Connection({
    prefixUrl: 'https://ifconfig.me',
})

const response = await connection.get('ip')
logger.info(response.body)
