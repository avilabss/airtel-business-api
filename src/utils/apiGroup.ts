import { Connection } from './connection.js'
import { State } from './state.js'

export class APIGroup {
    _connection: Connection
    _state: State

    constructor(connection: Connection, state: State) {
        this._connection = connection
        this._state = state
    }
}
