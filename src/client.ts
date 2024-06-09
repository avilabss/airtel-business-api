import { Authenticate } from './api/authenticate.js'
import { Connection } from './utils/connection.js'
import { State } from './utils/state.js'

export class Client {
    private connection: Connection
    private state: State

    authenticate: Authenticate

    constructor(connection?: Connection) {
        this.connection = connection || new Connection()
        this.state = new State()

        this.authenticate = new Authenticate(this.connection, this.state)
    }

    exportSession() {
        const localStorage = this.state.localStorage.get()
        return {
            accessToken: localStorage.accessToken,
            refreshToken: localStorage.refreshToken,
        }
    }

    importSession(session: { accessToken: string; refreshToken: string }) {
        this.state.localStorage.update((state) => {
            state.accessToken = session.accessToken
            state.refreshToken = session.refreshToken
        })
    }
}
