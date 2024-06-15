import { describe, it, expect, vi } from 'vitest'

import { Client } from '../../src/client'
import { ConnectionListResponse } from '../../src/types/connection'
import { ConnectionType, Lob } from '../../src/enums/connection'

const connectionListResponse = {
    data: [
        {
            connectionSi: '1111111111',
            status: 'Active',
            billableAccount: '1-11111',
            partyId: '1-11111',
            partyName: 'XXXX',
            billableName: 'XXXX',
            connectionType: 'Mobile',
            overUtilizationCutOff: 'NA',
            planName: 'INFINITY_299_30GB_CORP_PLAN',
            planPrice: '299',
            simNumber: '1111U',
            imsi: '1111',
            circle: 'XX',
            displayProductName: 'Mobile',
            customerClass: 'Small Enterprise',
            productName: 'Mobile',
            overUtilizationCutOffRange: ['70', '80', '90', '100'],
            weeklyOverUtilizationFrequency: 0,
            monthlyOverUtilizationFrequency: 0,
            userUpdateIdentifier: false,
            userDetails: {
                name: 'XXX  XXX',
                email: 'XXX@gmail.com',
                alternateNumber: '1111111111',
                designation: 'SR ACCOUNTANT',
                lastUpdated: 1684640797,
                poiType: 'Uid Card (Adhaar Card)',
                poiId: '11111',
                poaType: 'Uid Card (Adhaar Card)',
                poaId: '11111',
                userAddress: {
                    houseNo: 'X-XXX',
                    streetAddress: 'XXX XXX',
                    locality: 'XXX XXX',
                    landmark: 'XXX',
                    addrLine5: null,
                    district: null,
                    city: 'XXX XXX',
                    state: 'XXX',
                    zipcode: '1111',
                    addressType: 'Installation Address',
                },
            },
            dcpId: '',
            showUtiGraph: false,
            circleCode: '112',
            isUpgradeOrderAllowed: false,
        },
    ],
    totalCount: 50,
    displayCount: 10,
    mobileConnections: 0,
    dataConnections: 0,
    activeConnections: 0,
    totalFilterCount: 50,
    assetsFilter: { Status: ['All', 'Active'] },
    queryFilters: ['Plan', 'Connection Number', 'Billable Id', 'Billable Name', 'Circle', 'SIM Number'],
} as ConnectionListResponse

describe('Connection API test', () => {
    it('should get connection list', async () => {
        const client = new Client()
        vi.spyOn(client.connection, 'getList').mockResolvedValue(connectionListResponse)
        const response = await client.connection.getList({
            lob: Lob.MOBILITY,
            connectionType: ConnectionType.MOBILE,
            limit: 1,
            offset: 0,
        })
        expect(response).toEqual(connectionListResponse)
    })
})
