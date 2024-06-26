import { ConnectionType, Lob } from '../enums/connection.js'
import { GetConnectionListPayload, ConnectionListResponse, GetConnectionDetailsPayload } from '../types/connection.js'
import { APIGroup } from '../utils/apiGroup.js'

export class Connection extends APIGroup {
    async getList(options: {
        lob: Lob
        connectionType: ConnectionType | null
        limit: number
        offset: number
    }): Promise<ConnectionListResponse> {
        const url = `s/app/b2b-api/airtel-b2b-connection/rest/connection/v1/fetch/list/common`
        const headers = this._state.getDefaultHeaders()
        const payload: GetConnectionListPayload = {
            request: { lob: options.lob, connectionType: options.connectionType },
            paginationRequired: true,
            pagination: { limit: options.limit, offset: options.offset },
            sortingRequired: false,
            filterRequired: true,
            searchQuery: [],
        }
        const body = JSON.stringify(payload)
        const response = await this._connection.post(url, { headers, body })
        const responseJSON = JSON.parse(response.body)
        return responseJSON
    }

    async getDetails(options: {
        lob: Lob
        connectionType: ConnectionType | null
        connectionNumber: string
    }): Promise<ConnectionListResponse> {
        const url = `s/app/b2b-api/airtel-b2b-connection/rest/connection/v1/fetch/list/common`
        const headers = this._state.getDefaultHeaders()
        const payload: GetConnectionDetailsPayload = {
            request: { lob: options.lob, connectionType: options.connectionType, circuitId: options.connectionNumber },
            paginationRequired: true,
            pagination: { limit: 1, offset: 0 },
            sortingRequired: false,
            filterRequired: false,
            searchQuery: [],
        }
        const body = JSON.stringify(payload)
        const response = await this._connection.post(url, { headers, body })
        const responseJSON = JSON.parse(response.body)
        return responseJSON
    }
}
