import { got, OptionsOfTextResponseBody, type Got } from 'got'
import { HttpsProxyAgent, HttpProxyAgent } from 'hpagent'

import { encryptDataToString, decryptDatafromString, generateNewEncryptionKey } from './crypto.js'
import { logger } from './logger.js'
import { ConnectionOptions } from '../types/connection.js'

export class Connection {
    client: Got
    timeout: number
    proxyUrl?: string
    prefixUrl: string

    constructor(connectionOptions?: ConnectionOptions) {
        this.proxyUrl = connectionOptions?.proxyUrl
        this.timeout = connectionOptions?.timeout || 1000 * 60 * 2
        this.prefixUrl = connectionOptions?.prefixUrl || 'https://digi-api.airtel.in/as/app/b2b-api/'

        this.client = this.initialize()
    }

    private initialize() {
        const client = got.extend({
            prefixUrl: this.prefixUrl,
            decompress: true,
            followRedirect: true,
            timeout: {
                request: this.timeout,
            },
            hooks: {
                init: [
                    (optionsInit, options) => {
                        const controller = new AbortController()

                        if (this.proxyUrl) {
                            const httpProxyAgent = new HttpProxyAgent({ proxy: this.proxyUrl })
                            const httpsProxyAgent = new HttpsProxyAgent({ proxy: this.proxyUrl })

                            options.agent = {
                                http: httpProxyAgent,
                                https: httpsProxyAgent,
                            }
                        }

                        // Setup a timeout to abort the request if it takes too long
                        const timeoutId = setTimeout(() => {
                            controller.abort()
                        }, options.timeout.request)

                        options.signal = controller.signal

                        // Clear timeout after error
                        options.hooks.beforeError = options.hooks.beforeError || []
                        options.hooks.beforeError.push((error) => {
                            clearTimeout(timeoutId)
                            return error
                        })

                        // Clear timeout after response
                        options.hooks.afterResponse = options.hooks.afterResponse || []
                        options.hooks.afterResponse.push((response) => {
                            clearTimeout(timeoutId)
                            return response
                        })
                    },
                ],
                beforeRequest: [
                    (request) => {
                        if (request.method === 'GET') return
                        if (!request.body) return
                        if (request.headers['host'] !== 'digi-api.airtel.in') return

                        try {
                            const key = generateNewEncryptionKey()
                            const encryptedBody = encryptDataToString(request.body.toString(), key)

                            request.headers['adsHeader'] = key
                            request.body = encryptedBody
                        } catch (error) {
                            logger.error('Error encrypting request body', error)
                        }
                    },
                ],
                afterResponse: [
                    (response) => {
                        const key = response.headers['googlecookie']

                        if (!key) return response
                        if (!response.body) return response

                        try {
                            const decryptedBody = decryptDatafromString(response.body.toString(), key.toString())
                            response.body = JSON.parse(decryptedBody)
                        } catch (error) {
                            logger.error('Error decrypting response body', error)
                        }

                        return response
                    },
                ],
                beforeRetry: [],
            },
        })

        return client
    }

    async get(url: string | URL, options?: OptionsOfTextResponseBody) {
        return this.client.get(url, options)
    }

    async post(url: string | URL, options?: OptionsOfTextResponseBody) {
        return this.client.post(url, options)
    }
}