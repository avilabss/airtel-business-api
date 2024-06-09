import dotenv from 'dotenv'
dotenv.config()

import { describe, it, expect } from 'vitest'
import { Connection } from '../../src/utils/connection'

describe('Connection utils test', () => {
    it('should initialize connection without proxy', async () => {
        const connection = new Connection({
            prefixUrl: 'https://ifconfig.me',
        })

        const response = await connection.get('ip')
        expect(response.body).toBeDefined()
    })

    it('should initialize connection with proxy', async () => {
        const proxyUrl = process.env.PROXY_URL

        const connection = new Connection({
            prefixUrl: 'https://ifconfig.me',
        })

        const proxiedConnection = new Connection({
            prefixUrl: 'https://ifconfig.me',
            proxyUrl: proxyUrl,
        })

        const response = await connection.get('ip')
        const ip = response.body

        const proxiedResponse = await proxiedConnection.get('ip')
        const proxiedIp = proxiedResponse.body

        expect(ip).not.toBe(proxiedIp)
        expect(ip).toBeDefined()
        expect(proxiedIp).toBeDefined()
    })
})
