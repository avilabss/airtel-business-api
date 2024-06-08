import { Hello } from '../src/index'

describe('Run Hello', () => {
    test(
        'running hello',
        () => {
            const hello = new Hello('world')
            const res = hello.run()
            expect(res).toBe('Hello world!')
        },
        // 1 hour timeout
        1000 * 60 * 60 * 1
    )
})
