import { GrantType, UserStatus } from '../enums/authenticate.js'
import { InvalidEmail, UnknownResponse } from '../exceptions/clientError.js'
import {
    AuthenticatePayload,
    AuthenticateResponse,
    InvalidCredentialsResponse,
    ValidateEmailResponse,
} from '../types/authenticate.js'
import { APIGroup } from '../utils/apiGroup.js'
import { encryptDataToString, generateNewEncryptionKey } from '../utils/crypto.js'
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
        const key = generateNewEncryptionKey()
        const headers = this._state.getDefaultHeaders()
        headers['adsheader'] = key
        const searchParams = { emailId: email }
        const response = await this._connection.get(url, { headers, searchParams })
        const responseJSON = JSON.parse(response.body)

        if (this.isValidateEmailResponse(responseJSON)) {
            return responseJSON
        }

        throw new InvalidEmail(`Invalid email: ${email}`)
    }

    async usingPassword(email: string, password: string): Promise<AuthenticateResponse | InvalidCredentialsResponse> {
        const validateEmailResponse = await this.validateEmail(email)
        logger.debug(`validateEmailResponse: ${JSON.stringify(validateEmailResponse)}`)

        const url = 'airtel-b2b-profile/rest/user/v2/authenticate'
        const key = generateNewEncryptionKey()
        const headers = this._state.getDefaultHeaders()
        headers['adsheader'] = key
        const payload: AuthenticatePayload = {
            emailId: email,
            password: password,
            grantType: GrantType.PASSWORD,
        }
        const body = encryptDataToString(JSON.stringify(payload), key)
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
