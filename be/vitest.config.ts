import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
        globalSetup: ['src/test/globalSetup.ts'],
        setupFiles: ['src/test/setup.ts'],
        fileParallelism: false,
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            exclude: ['src/test/**', 'src/index.ts'],
            reporter: ['text', 'html'],
        },
    },
})
