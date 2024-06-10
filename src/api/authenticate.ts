import { GrantType, UserStatus } from '../enums/authenticate.js'
import { InvalidEmail, UnknownResponse } from '../exceptions/clientError.js'
import {
    AuthenticatePayload,
    AuthenticateResponse,
    InvalidCredentialsResponse,
    ValidateEmailResponse,
} from '../types/authenticate.js'
import { APIGroup } from '../utils/apiGroup.js'
import { logger } from '../utils/logger.js'

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

    private async validateEmail(email: string): Promise<ValidateEmailResponse> {
        const url = 'airtel-b2b-profile/rest/user/validate'
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

        const url = 'airtel-b2b-profile/rest/user/v2/authenticate'
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
}
