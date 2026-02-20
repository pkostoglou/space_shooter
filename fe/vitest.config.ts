import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
    define: {
        'import.meta.env.VITE_BASE_URL': JSON.stringify('http://localhost:8000/api'),
        'import.meta.env.VITE_WS_BASE_URL': JSON.stringify('ws://localhost:8000'),
    },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: ['src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            exclude: ['src/test/**', 'src/main.tsx', 'src/Elements/**'],
            reporter: ['text', 'html'],
        },
    },
}))
