import { GrantType, UserStatus } from '../enums/authenticate.js'
import { InvalidEmail, SessionExpired, UnknownResponse } from '../exceptions/clientError.js'
import {
    AuthenticatePayload,
    AuthenticateResponse,
    ValidSessionResponse,
    InvalidCredentialsResponse,
    ValidateEmailResponse,
    InvalidSessionResponse,
    RefreshTokenResponse,
} from '../types/authenticate.js'
import { APIGroup } from '../utils/apiGroup.js'

export class Authenticate extends APIGroup {
    private isAuthenticateResponse(response: any): response is AuthenticateResponse {
        return response.success !== undefined
    }

    private isInvalidCredentialsResponse(response: any): response is InvalidCredentialsResponse {
        return response.code !== undefined
    }

    private isValidateEmailResponse(response: any): response is ValidateEmailResponse {
        return response.userStatus === UserStatus.ACTIVE && response.isExistingCustomer && response.isRegisteredInAEH
    }

    private isValidSessionResponse(response: any): response is ValidSessionResponse {
        return response.success === true
    }

    private isInvalidSessionResponse(response: any): response is InvalidSessionResponse {
        return response.errorCode !== undefined
    }

    private isRefreshTokenResponse(response: any): response is RefreshTokenResponse {
        return response.accessToken !== undefined
    }

    async validateEmail(email: string): Promise<ValidateEmailResponse> {
        const url = 'as/app/b2b-api/airtel-b2b-profile/rest/user/validate'
        const headers = this._state.getDefaultHeaders()
        const searchParams = { emailId: email }
        const response = await this._connection.get(url, { headers, searchParams })
        const responseJSON = JSON.parse(response.body)

        if (this.isValidateEmailResponse(responseJSON)) {
            return responseJSON
        }

        throw new InvalidEmail(`Invalid email: ${email}`)
    }

    async usingPassword(email: string, password: string): Promise<AuthenticateResponse | InvalidCredentialsResponse> {
        await this.validateEmail(email)

        const url = 'as/app/b2b-api/airtel-b2b-profile/rest/user/v2/authenticate'
        const headers = this._state.getDefaultHeaders()
        const payload: AuthenticatePayload = {
            emailId: email,
            password: password,
            grantType: GrantType.PASSWORD,
        }
        const body = JSON.stringify(payload)
        const response = await this._connection.post(url, { headers, body })
        const responseJSON = JSON.parse(response.body)

        if (this.isAuthenticateResponse(responseJSON)) {
            this._state.localStorage.update((state) => {
                state.accessToken = responseJSON.accessToken
                state.refreshToken = responseJSON.refreshToken
            })

            return responseJSON
        } else if (this.isInvalidCredentialsResponse(responseJSON)) {
            return responseJSON
        }

        throw new UnknownResponse(`Unknown response: ${JSON.stringify(responseJSON)}`)
    }

    async checkSession(): Promise<ValidSessionResponse> {
        const url = 's/app/b2b-api/airtel-b2b-profile/rest/user/v1/check/session'
        const headers = this._state.getDefaultHeaders()

        const response = await this._connection.get(url, { headers, throwHttpErrors: false })
        const responseJSON = JSON.parse(response.body)

        if (response.statusCode === 401) {
            this._state.localStorage.update((state) => {
                state.accessToken = null
                state.refreshToken = null
            })

            if (this.isInvalidSessionResponse(responseJSON)) {
                throw new SessionExpired(responseJSON.errorMessage)
            }
        }

        if (this.isValidSessionResponse(responseJSON)) {
            return responseJSON
        }

        throw new UnknownResponse(`Unknown response: ${JSON.stringify(responseJSON)}`)
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        const url = 'as/app/b2b-api/airtel-b2b-profile/rest/user/v1/refresh/token'
        const localStorage = this._state.localStorage.get()
        const headers = {
            ...this._state.getDefaultHeaders(),
            refreshToken: localStorage.refreshToken!,
        }

        const response = await this._connection.get(url, { headers })
        const responseJSON = JSON.parse(response.body)

        if (this.isRefreshTokenResponse(responseJSON)) {
            this._state.localStorage.update((state) => {
                state.accessToken = responseJSON.accessToken
            })

            return responseJSON
        }

        throw new UnknownResponse(`Unknown response: ${JSON.stringify(responseJSON)}`)
    }
}
