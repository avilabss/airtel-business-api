import { Code, ErrorCode, GrantType, ResourceLayer, UserStatus } from '../enums/authenticate.js'

export type AuthenticatePayload = {
    emailId: string
    password: string
    grantType: GrantType
}

export type AuthenticateResponse = {
    success: boolean
    accessToken: string
    refreshToken: string
    firstTimeUser: boolean
    sameDayLogin: boolean
    profileType: null | any
    redirectUri: string | null
}

export type InvalidCredentialsResponse = {
    code: Code
    title: string
    messageType: string
    message: string
}

export type ValidateEmailResponse = {
    userStatus: UserStatus | null
    isExistingCustomer: boolean
    isRegisteredInAEH: boolean
    isInternalUser: boolean
    isExistingCustomerWithDataLob: boolean
    isReadOnlySuperAdmin: boolean
}

export type ValidSessionResponse = {
    success: boolean
    loginId: string
}

export type InvalidSessionResponse = {
    errorCode: ErrorCode
    errorType: null | any
    apiPath: null | any
    errorDetails: null | any
    resourceLayer: ResourceLayer
    errorMeta: null | any
    httpStatus: number
    displayMessage: string
    errorMessage: string
}
