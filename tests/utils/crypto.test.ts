import { describe, it, expect } from 'vitest'
import { encryptDataToString, decryptDatafromString, generateNewEncryptionKey } from '../../src/utils/crypto'

describe('Crypto utils test', () => {
    it('should encrypt', () => {
        const data = 'Secret encrypted message'
        const key = 'ATB_PROD_1717859031952_zOwXSKR9fttPODP0BcNogMI16IFyeI'
        const encryptedData = encryptDataToString(data, key)
        const expectedEncryptedData = '0wW4vJfIuIfmWwCw9p2ya8/N3fJcfE69+LPPcbuTH68='
        expect(encryptedData).toBe(expectedEncryptedData)
    })

    it('should decrypt', () => {
        const encryptedData = 'eNZ9X5o2n9hZqU7JMj2pDkGizEg1k73dZ0jqF47EDIE='
        const key = '23e59b9901fb092c801adaf993dcb300ade6c586'
        const decryptedData = decryptDatafromString(encryptedData, key)
        const expectedDecryptedData = 'Secret encrypted message'
        expect(decryptedData).toEqual(expectedDecryptedData)
    })

    it('should encrypt and decrypt', () => {
        const data = 'Secret encrypted message'
        const key = generateNewEncryptionKey()
        const encryptedData = encryptDataToString(data, key)
        const decryptedData = decryptDatafromString(encryptedData, key)
        expect(decryptedData).toEqual(data)
    })

    it('should generate new encryption key', () => {
        const key = generateNewEncryptionKey()
        expect(key).toMatch(/ATB_PROD_\d{13}_[\w-]{30}/)
    })
})
