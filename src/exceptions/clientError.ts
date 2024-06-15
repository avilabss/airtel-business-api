import { ClientError } from './baseError.js'

export class UnknownResponse extends ClientError {
    message: string

    constructor(message: string) {
        super(message)
        this.message = message
    }
}

export class InvalidEmail extends ClientError {
    message: string

    constructor(message: string) {
        super(message)
        this.message = message
    }
}

export class SessionExpired extends ClientError {
    message: string

    constructor(message: string) {
        super(message)
        this.message = message
    }
}
