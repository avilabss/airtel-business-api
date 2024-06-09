import { createState, StatemanjsAPI } from '@persevie/statemanjs'
import { LocalStorage } from '../types/state.js'

export class State {
    localStorage: StatemanjsAPI<LocalStorage>

    constructor() {
        this.localStorage = this.createLocalStorage()
    }

    private createLocalStorage() {
        return createState<LocalStorage>({
            refreshToken: null,
            accessToken: null,
            pageURL: 'https://www.airtel.in/business/thanksforbusiness/login/',
        })
    }

    private getStaticHeaders() {
        const headers: Record<string, string> = {}

        headers['accept'] = 'application/json, text/plain, */*'
        headers['accept-encoding'] = 'gzip, deflate, br, zstd'
        headers['accept-language'] = 'en-GB,en-US;q=0.9,en;q=0.8'
        headers['app-id'] = 'SELFCARE'
        headers['connection'] = 'keep-alive'
        headers['content-type'] = 'application/json'
        headers['googlecookie'] = 'airtel.com'
        headers['host'] = 'digi-api.airtel.in'
        headers['origin'] = 'https://www.airtel.in'
        headers['referer'] = 'https://www.airtel.in/'
        headers['requesterid'] = 'WEB'
        headers['sec-ch-ua'] = `"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`
        headers['sec-ch-ua-mobile'] = '?0'
        headers['sec-ch-ua-platform'] = `"macOS"`
        headers['sec-fetch-dest'] = 'empty'
        headers['sec-fetch-mode'] = 'cors'
        headers['sec-fetch-site'] = 'cross-site'

        // prettier-ignore
        headers['user-agent'] = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36`

        return headers
    }

    private getDynamicHeaders() {
        const localStorage = this.localStorage.get()
        const headers: Record<string, string> = {}

        headers['pageurl'] = localStorage.pageURL

        if (localStorage.accessToken) {
            headers['authorization'] = `Bearer ${localStorage.accessToken}`
        }

        return headers
    }

    getDefaultHeaders() {
        const headers: Record<string, string> = {
            ...this.getStaticHeaders(),
            ...this.getDynamicHeaders(),
        }

        return headers
    }
}
