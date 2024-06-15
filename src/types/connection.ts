import { ConnectionType, Lob, QueryFilters, Status } from '../enums/connection.js'

export type ConnectionOptions = {
    proxyUrl?: string
    timeout?: number
    prefixUrl?: string
}

export type Request = {
    lob: Lob
    connectionType: ConnectionType
}

export type Pagination = {
    limit: number
    offset: number
}

export type GetConnectionListPayload = {
    request: Request
    paginationRequired: boolean
    pagination: Pagination
    sortingRequired: boolean
    filterRequired: boolean
    searchQuery: []
}

export type UserAddress = {
    houseNo: string
    streetAddress: string
    locality: string
    landmark: string
    addrLine5: null | string
    district: null | string
    city: string
    state: string
    zipcode: string
    addressType: string
}

export type UserDetails = {
    name: string
    email: string
    alternateNumber: string
    designation: string
    lastUpdated: number
    poiType: string
    poiId: string
    poaType: string
    poaId: string
    userAddress: UserAddress
}

export type ConnectionListData = {
    connectionSi: string
    status: Status
    billableAccount: string
    partyId: string
    partyName: string
    billableName: string
    connectionType: string
    overUtilizationCutOff: string
    planName: string
    planPrice: string
    simNumber: string
    imsi: string
    circle: string
    displayProductName: string
    customerClass: string
    productName: string
    overUtilizationCutOffRange: string[]
    weeklyOverUtilizationFrequency: number
    monthlyOverUtilizationFrequency: number
    userUpdateIdentifier: boolean
    userDetails: UserDetails
    dcpId: string
    showUtiGraph: boolean
    circleCode: string
    isUpgradeOrderAllowed: boolean
}

export type ConnectionListResponse = {
    data: ConnectionListData[]
    totalCount: number
    displayCount: number
    mobileConnections: number
    dataConnections: number
    activeConnections: number
    totalFilterCount: number
    assetsFilter: { Status: Status[] }
    queryFilters: QueryFilters[]
}
