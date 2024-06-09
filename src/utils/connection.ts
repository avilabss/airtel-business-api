import got, { OptionsOfTextResponseBody, type Got } from 'got'
import { HttpsProxyAgent, HttpProxyAgent } from 'hpagent'

export class Connection {
    client: Got
    timeout: number
    proxyUrl?: string

    constructor(proxyUrl?: string, timeout?: number) {
        this.proxyUrl = proxyUrl
        this.timeout = timeout || 1000 * 60 * 2
        this.client = this.initialize()
    }

    private initialize() {
        const client = got.extend({
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
                beforeRequest: [],
                afterResponse: [],
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
