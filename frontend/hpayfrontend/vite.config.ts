import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig(async ({ mode }) => {
  // Load .env so VITE_API_BASE_URL is available at config time
  const env = loadEnv(mode, process.cwd(), '');

  const port = parseInt(process.env.PORT ?? '5173', 10);
  const backendUrl = env.VITE_API_BASE_URL ?? 'http://localhost:8080';

  const isReplit =
    process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined;

  return {
    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),
      ...(isReplit
        ? [
            await import('@replit/vite-plugin-cartographer').then((m) =>
              m.cartographer(),
            ),
            await import('@replit/vite-plugin-dev-banner').then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],
    define: {
      // Polyfills needed by @solana/web3.js and buffer in browser
      'process.env': '{}',
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['buffer', '@solana/web3.js'],
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(import.meta.dirname, 'attached_assets'),
        // Use the npm buffer package instead of Node's built-in
        buffer: 'buffer/',
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist'),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        // /api/* → local backend, stripping the /api prefix
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
