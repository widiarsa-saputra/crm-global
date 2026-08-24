import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// 1. Buat Custom Plugin untuk generate version.json
function versionPlugin(): Plugin {
  return {
    name: 'version-plugin',
    // Untuk development: serve version.json secara dinamis
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/version.json')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            version: 'dev',
            buildTime: new Date().toISOString()
          }));
        } else {
          next();
        }
      });
    },
    // Untuk production: buat file version.json di dalam build output
    generateBundle() {
      const version = Date.now().toString();
      const versionData = {
        version,
        buildTime: new Date().toISOString()
      };
      
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify(versionData, null, 2)
      });
      console.log(`✅ File version.json berhasil dibuat (Versi: ${version})`);
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    versionPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/wa-api': {
        target: 'https://whatsapp-api.gotrasoft.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wa-api/, ''),
      },
    },
  },
})
