import { Code, GrantType, UserStatus } from '../enums/authenticate'

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
    userStatus: UserStatus // Needs to be 'ACTIVE'
    isExistingCustomer: boolean // Needs to be true
    isRegisteredInAEH: boolean // Needs to be true
    isInternalUser: boolean
    isExistingCustomerWithDataLob: boolean
    isReadOnlySuperAdmin: boolean
}
