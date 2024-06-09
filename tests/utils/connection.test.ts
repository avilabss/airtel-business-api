import dotenv from 'dotenv'
dotenv.config()

import { describe, expect, it } from '@jest/globals'

import { Connection } from '../../src/utils/connection'

describe('Connection utils test', () => {
    it('should initialize connection', () => {
        const connection = new Connection({
            prefixUrl: 'https://ifconfig.me',
        })

        const response = connection.get('ip')
        expect(response).toBeDefined()
    })
})
