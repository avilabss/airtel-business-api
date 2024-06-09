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
            userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36`,
        })
    }

    private getStaticHeaders() {
        const headers: Record<string, string> = {}

        headers['Accept'] = 'application/json, text/plain, */*'
        headers['Accept-Encoding'] = 'gzip, deflate, br, zstd'
        headers['Accept-Language'] = 'en-GB,en-US;q=0.9,en;q=0.8'
        headers['app-id'] = 'SELFCARE'
        headers['Connection'] = 'keep-alive'
        headers['Content-Type'] = 'application/json'
        headers['googleCookie'] = 'airtel.com'
        headers['Origin'] = 'https://www.airtel.in'
        headers['Referer'] = 'https://www.airtel.in/'
        headers['requesterId'] = 'WEB'

        return headers
    }

    private getDynamicHeaders() {
        const localStorage = this.localStorage.get()
        const headers: Record<string, string> = {}

        headers['pageURL'] = localStorage.pageURL
        headers['User-Agent'] = localStorage.userAgent

        if (localStorage.accessToken) {
            headers['Authorization'] = `Bearer ${localStorage.accessToken}`
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
