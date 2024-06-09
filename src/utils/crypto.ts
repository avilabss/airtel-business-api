import * as crypto from 'crypto'
import cryptoJS from 'crypto-js'

function nanoID(length: number) {
    return crypto
        .getRandomValues(new Uint8Array(length))
        .reduce(
            (t, e) =>
                t +
                ((e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? '-' : '_'),
            ''
        )
}

export function generateNewEncryptionKey() {
    return `ATB_PROD_${Date.now()}_${nanoID(30)}`
}

export function encryptDataToString(data: string, key: string) {
    return cryptoJS.DES.encrypt(data, cryptoJS.enc.Utf8.parse(key), {
        mode: cryptoJS.mode.ECB,
        padding: cryptoJS.pad.Pkcs7,
    }).toString()
}

export function decryptDatafromString(data: string, key: string) {
    return cryptoJS.DES.decrypt(data.replace('"', ''), cryptoJS.enc.Utf8.parse(key), {
        mode: cryptoJS.mode.ECB,
        padding: cryptoJS.pad.Pkcs7,
    }).toString(cryptoJS.enc.Utf8)
}
