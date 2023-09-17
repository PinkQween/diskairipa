import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  },
});
