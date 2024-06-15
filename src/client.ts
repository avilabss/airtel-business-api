import { Authenticate } from './api/authenticate.js'
import { Connection } from './api/connection.js'
import { Connection as _Connection } from './utils/connection.js'
import { State } from './utils/state.js'

export class Client {
    _connection: _Connection
    _state: State

    authenticate: Authenticate
    connection: Connection

    constructor(connection?: _Connection) {
        this._connection = connection || new _Connection()
        this._state = new State()

        this.authenticate = new Authenticate(this._connection, this._state)
        this.connection = new Connection(this._connection, this._state)
    }

    exportSession() {
        const localStorage = this._state.localStorage.get()
        return {
            accessToken: localStorage.accessToken,
            refreshToken: localStorage.refreshToken,
        }
    }

    importSession(session: { accessToken: string; refreshToken: string }) {
        this._state.localStorage.update((state) => {
            state.accessToken = session.accessToken
            state.refreshToken = session.refreshToken
        })
    }
}
