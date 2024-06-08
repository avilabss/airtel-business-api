import type { Config } from 'jest'

export default async (): Promise<Config> => {
    return {
        preset: 'ts-jest',
        transform: {
            '^.+\\.(ts|tsx)?$': 'ts-jest',
            '^.+\\.(js|jsx)$': 'babel-jest',
        },
    }
}
