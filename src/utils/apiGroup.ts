import { Connection } from './connection.js'
import { State } from './state.js'

export class APIGroup {
    connection: Connection
    state: State

    constructor(connection: Connection, state: State) {
        this.connection = connection
        this.state = state
    }
}
