import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // HMR für Docker
        watch: {
          usePolling: true,
        },
      },
      plugins: [react()],
      define: {
        // Ollama Konfiguration
        'import.meta.env.VITE_OLLAMA_URL': JSON.stringify(env.VITE_OLLAMA_URL || 'http://localhost:11434'),
        'import.meta.env.VITE_OLLAMA_MODEL': JSON.stringify(env.VITE_OLLAMA_MODEL || 'gpt-oss:120b'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
