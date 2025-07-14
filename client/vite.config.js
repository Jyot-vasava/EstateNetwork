import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://estate-network-backend-api.onrender.com",
        // target: "http://localhost:3000",
        changeOrigin: true, // proxy to localhost:3000
        secure: false, // if the target is using https, set this to true
      },
    },
  },

  plugins: [react(), tailwindcss()],
});
