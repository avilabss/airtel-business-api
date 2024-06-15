import { describe, it, expect, vi } from 'vitest'

import { Client } from '../../src/client'
import { InvalidEmail, SessionExpired, UnknownResponse } from '../../src/exceptions/clientError'
import {
    AuthenticateResponse,
    InvalidCredentialsResponse,
    InvalidSessionResponse,
    RefreshTokenResponse,
    ValidateEmailResponse,
    ValidSessionResponse,
} from '../../src/types/authenticate'
import { Code, ErrorCode, ResourceLayer, UserStatus } from '../../src/enums/authenticate'

const validEmailResponse: ValidateEmailResponse = {
    userStatus: UserStatus.ACTIVE,
    isExistingCustomer: true,
    isRegisteredInAEH: true,
    isInternalUser: false,
    isExistingCustomerWithDataLob: false,
    isReadOnlySuperAdmin: false,
}

const authenticateResponse: AuthenticateResponse = {
    success: true,
    accessToken: 'xxxx',
    refreshToken: 'yyy',
    firstTimeUser: false,
    sameDayLogin: false,
    profileType: null,
    redirectUri: null,
}

const invalidCredentialsResponse: InvalidCredentialsResponse = {
    code: Code.ATTEMPT_LIMIT_EXCEED,
    title: 'ERROR',
    messageType: 'ERROR',
    message:
        'Invalid password. 2 out of 3 attempts left, post that your password login would be locked for 24hrs. However, you will be able to login using OTP.',
}

const unknownResponse = {
    thisIs: 'unknown',
}

const invalidSessionResponse: InvalidSessionResponse = {
    errorCode: ErrorCode.JWT_TOKEN_EXPIRED,
    errorType: null,
    apiPath: null,
    errorDetails: null,
    resourceLayer: ResourceLayer.SERVICE,
    errorMeta: null,
    httpStatus: 401,
    displayMessage: 'Token is expired',
    errorMessage: 'The Token has expired on Tue Jun 11 01:11:57 IST 2024.',
}

const validSessionResponse: ValidSessionResponse = {
    success: true,
    loginId: 'XYZ@GMAIL.COM',
}

const refreshTokenResponse: RefreshTokenResponse = {
    accessToken: 'xxx',
    tokenType: 'Bearer',
    expiresIn: 1718480717,
    refreshToken: null,
    userUuid: 'XXX@gmail.com',
    redirectUri: null,
    errorCode: null,
}

describe('Authenticate API test', () => {
    it('should validate email', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'validateEmail').mockResolvedValue(validEmailResponse)
        const response = await client.authenticate.validateEmail('XYZ@GMAIL.COM')
        expect(response).toEqual(validEmailResponse)
    })

    it('should throw InvalidEmail error if email is invalid', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'validateEmail').mockRejectedValue(new InvalidEmail('XYZ@GMAIL.COM'))
        expect(client.authenticate.validateEmail('XYZ@GMAIL.COM')).rejects.toThrow(InvalidEmail)
    })

    it('should authenticate using password', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'validateEmail').mockResolvedValue(validEmailResponse)
        vi.spyOn(client.authenticate, 'usingPassword').mockResolvedValue(authenticateResponse)
        const response = await client.authenticate.usingPassword('XYZ@GMAIL.COM', 'password')
        expect(response).toEqual(authenticateResponse)
    })

    it('should fail to authenticate using password', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'validateEmail').mockResolvedValue(validEmailResponse)
        vi.spyOn(client.authenticate, 'usingPassword').mockResolvedValue(invalidCredentialsResponse)
        const response = await client.authenticate.usingPassword('XYZ@GMAIL.COM', 'password')
        expect(response).toBe(invalidCredentialsResponse)
    })

    it('should check if session is valid', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'checkSession').mockResolvedValue(validSessionResponse)
        const response = await client.authenticate.checkSession()
        expect(response).toEqual(validSessionResponse)
    })

    it('should throw SessionExpired error if session is invalid', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'checkSession').mockRejectedValue(
            new SessionExpired(invalidSessionResponse.errorMessage)
        )
        await expect(client.authenticate.checkSession()).rejects.toThrow(SessionExpired)
    })

    it('should throw UnknownResponse error if response is unknown', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'checkSession').mockRejectedValue(
            new UnknownResponse(`Unknown response: ${JSON.stringify(unknownResponse)}`)
        )
        await expect(client.authenticate.checkSession()).rejects.toThrow(UnknownResponse)
    })

    it('should refresh token', async () => {
        const client = new Client()
        vi.spyOn(client.authenticate, 'refreshToken').mockResolvedValue(refreshTokenResponse)
        const response = await client.authenticate.refreshToken()
        expect(response).toEqual(refreshTokenResponse)
    })
})
