import { got, Headers, OptionsOfTextResponseBody, Response, type Got } from 'got'
import { HttpsProxyAgent, HttpProxyAgent } from 'hpagent'

import { decryptDatafromString, encryptDataToString, generateNewEncryptionKey } from './crypto.js'
import { logger } from './logger.js'
import { ConnectionOptions } from '../types/connection.js'
import { headerKeysOrderFormat } from './constants.js'

export class Connection {
    client: Got
    timeout: number
    proxyUrl?: string
    prefixUrl: string
    lastResponse?: Response<unknown>

    constructor(connectionOptions?: ConnectionOptions) {
        this.proxyUrl = connectionOptions?.proxyUrl
        this.timeout = connectionOptions?.timeout || 1000 * 60 * 2
        this.prefixUrl = connectionOptions?.prefixUrl || 'https://digi-api.airtel.in/as/app/b2b-api/'

        this.client = this.initialize()
    }

    private sortFormatHeaders(headers: Headers) {
        const finalHeaders: Headers = {}
        const lowerCaseHeaders: Headers = {}
        const headerKeysOrderFormatLower = headerKeysOrderFormat.map((key) => key.toLowerCase())

        // Convert headers
        for (let key in headers) {
            lowerCaseHeaders[key.toLowerCase()] = headers[key]
        }

        // Add known headers in order
        for (let key of headerKeysOrderFormat) {
            let keyLower = key.toLowerCase()
            if (keyLower in lowerCaseHeaders) {
                finalHeaders[key] = lowerCaseHeaders[keyLower]
            }
        }

        // Add unknown headers
        for (let key in headers) {
            let keyLower = key.toLowerCase()
            if (!headerKeysOrderFormatLower.includes(keyLower)) {
                finalHeaders[key] = headers[key]
            }
        }

        return finalHeaders
    }

    private initialize() {
        const client = got.extend({
            prefixUrl: this.prefixUrl,
            decompress: true,
            followRedirect: true,
            // http2: true,
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
                        if (request.headers['host'] === 'digi-api.airtel.in') {
                            const key = generateNewEncryptionKey()
                            request.headers['adsheader'] = key

                            if (request.body) {
                                request.body = `"${encryptDataToString(request.body.toString(), key)}"`
                                request.headers['content-length'] = request.body.length.toString()
                            }
                        }

                        request.headers = this.sortFormatHeaders(request.headers)
                        logger.debug(`${request.method} ${request.url?.toString()}\n${JSON.stringify(request.headers)}`)
                    },
                ],
                afterResponse: [
                    (response) => {
                        this.lastResponse = response
                        const key = response.headers['googlecookie']

                        if (!key) return response
                        if (!response.body) return response

                        try {
                            const decryptedBody = decryptDatafromString(
                                response.body.toString().replace('"', ''),
                                key.toString()
                            )
                            response.body = decryptedBody
                        } catch (error) {
                            logger.error('Error decrypting response body', error)
                        }

                        logger.debug(`${response.statusCode} ${JSON.stringify(response.headers)}`)
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
